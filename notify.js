'use strict'

const _ = require('lodash')
const path = require('path')
const async = require('async')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

// One animation at a time
const AnimationQueue = function(options) {
  this.options = options
  this.queue = []
  this.running = false
}

AnimationQueue.prototype.push = function(object) {
  if (this.running) {
    this.queue.push(object)
  } else {
    this.running = true
    this.animate(object)
  }
}

AnimationQueue.prototype.animate = function(object) {
  let self = this
  object.func.apply(null, object.args)
  .then(function() {
    if (self.queue.length > 0) {
      // Run next animation
      self.animate.call(self, self.queue.shift())
    } else {
      self.running = false
    }
  })
  .catch(function(err) {
    log('electron-notify encountered an error!')
    log('Please submit the error stack and code samples to: https://github.com/dooyou21/electron-notify/issues')
    log(err.stack)
  })
}

AnimationQueue.prototype.clear = function() {
  this.queue = []
}

let config = {
  width: 300,
  height: 65,
  padding: 10,
  borderRadius: 5,
  displayTime: 5000,
  animationSteps: 5,
  animationStepMs: 5,
  animateInParallel: true,
  appIcon: null,
  pathToModule: '',
  logging: true,
  defaultStyleContainer: {
    backgroundColor: '#fefefe',
    overflow: 'hidden',
    padding: 8,
    border: '1px solid #fefefe',
    fontFamily: 'Arial',
    fontSize: 12,
    position: 'relative',
    lineHeight: '15px'
  },
  defaultStyleAppIcon: {
    height: 48,
    width: 48
  },
  defaultStyleImage: {
    height: 48,
    width: 48
  },
  defaultStyleClose: {
    top: 12,
    right: 12,
  },
  defaultStyleText: {
    margin: 0,
    overflow: 'hidden',
    cursor: 'default'
  },
  defaultWindow: {
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    frame: false,
    transparent: true,
    acceptFirstMouse: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      allowDisplayingInsecureContent: true
    }
  },
}

function setConfig(customConfig) {
  config = _.defaults(customConfig, config)
  calcDimensions()
  return config
}

function setDefaultWindowConfig(customConfig) {
  config.defaultWindow = _.defaults(customConfig, config.defaultWindow)
  return config.DefaultWindow
}

function updateTemplatePath() {
  let templatePath = path.join(__dirname, 'static/notification.html')
  // Tricky stuff, sometimes this doesn't work,
  // especially when webpack is involved.
  // Check if we have a file at that location
  try {
    require('fs').statSync(templatePath).isFile()
  } catch (err) {
    log('electron-notify: Could not find template ("' + templatePath + '").')
    log('electron-notify: To use a different template you need to correct the config.templatePath or simply adapt config.htmlTemplate')
     // TODO: No file => should we create our own temporary notification.html?
  }
  config.templatePath = 'file://' + templatePath
  return config.templatePath
}

function getTemplatePath() {
  if (config.templatePath === undefined) {
    return updateTemplatePath()
  }
  return config.templatePath
}

function setTemplatePath(path) {
  config.templatePath = path
}

let nextInsertPos = {}
function calcDimensions() {
  // Calc totalHeight & totalWidth
  config.totalHeight = config.height + config.padding
  config.totalWidth = config.width + config.padding

  // Calc pos of first notification:
  config.firstPos = {
    x: config.lowerRightCorner.x - config.totalWidth,
    y: config.lowerRightCorner.y - config.totalHeight
  }

  // Set nextInsertPos
  nextInsertPos.x = config.firstPos.x
  nextInsertPos.y = config.firstPos.y
}

function setupConfig() {
  // Use primary display only
  let display = electron.screen.getPrimaryDisplay()

  // Display notifications starting from lower right corner
  // Calc lower right corner
  config.lowerRightCorner = {}
  config.lowerRightCorner.x = display.bounds.x + display.workArea.x + display.workAreaSize.width
  config.lowerRightCorner.y = display.bounds.y + display.workArea.y + display.workAreaSize.height

  calcDimensions()

  // Maximum amount of Notifications we can show:
  config.maxVisibleNotifications = Math.floor(display.workAreaSize.height / config.totalHeight)
  config.maxVisibleNotifications = config.maxVisibleNotifications > 7 ? 7 : config.maxVisibleNotifications
}

setupConfig()

// Array of windows with currently showing notifications
let activeNotifications = []
let activeNotificationsId = []

// Recycle windows
let inactiveWindows = []

// If we cannot show all notifications, queue them
let notificationQueue = []

// To prevent executing mutliple animations at once
let animationQueue = new AnimationQueue()

// To prevent double-close notification window
let closedNotifications = {}

// Give each notification a unique id
let latestID = 0

function notify(notification) {
  // Is it an object and only one argument?
  if (arguments.length === 1 && typeof notification === 'object') {
    // Use object instead of supplied parameters
    notification.id = latestID

    latestID++
    animationQueue.push({
      func: showNotification,
      args: [ notification ]
    })
    return notification.id
  } else {
    // Since 1.0.0 all notification parameters need to be passed
    // as object.
    log('electron-notify: ERROR notify() only accepts a single object with notification parameters.')
  }
}

function showNotification(notificationObj) {
  return new Promise(function(resolve) {
    // Can we show it?
    if (activeNotifications.length < config.maxVisibleNotifications) {
      // Get inactiveWindow or create new:
      getWindow().then(function(notificationWindow) {
        // Move window to position
        calcInsertPos()
        notificationWindow.setPosition(nextInsertPos.x, nextInsertPos.y)

        // Add to activeNotifications
        activeNotifications.push(notificationWindow)
        activeNotificationsId.push(notificationObj.id)

        // Display time per notification basis.
        let displayTime = notificationObj.displayTime ? notificationObj.displayTime : config.displayTime

        // Set timeout to hide notification
        let timeoutId
        let closeFunc = buildCloseNotification(notificationWindow, notificationObj, function() {
          return timeoutId
        })
        let closeNotificationSafely = buildCloseNotificationSafely(closeFunc)
        timeoutId = setTimeout(function() {
          closeNotificationSafely('timeout')
        }, displayTime)

        // Trigger onShowFunc if existent
        if (notificationObj.onShowFunc) {
          notificationObj.onShowFunc({
            event: 'show',
            id: notificationObj.id,
            closeNotification: closeNotificationSafely
          })
        }

        // Save onClickFunc in notification window
        if (notificationObj.onClickFunc) {
          notificationWindow.electronNotifyOnClickFunc = notificationObj.onClickFunc
        } else {
          delete notificationWindow.electronNotifyOnClickFunc
        }

        if (notificationObj.onCloseFunc) {
          notificationWindow.electronNotifyOnCloseFunc = notificationObj.onCloseFunc
        } else {
          delete notificationWindow.electronNotifyOnCloseFunc
        }

        // Set contents, ...
        notificationWindow.webContents.send('electron-notify-set-contents', notificationObj)
        // Show window
        notificationWindow.showInactive()
        resolve(notificationWindow)
      })
    } else { // Add to notificationQueue
      notificationQueue.push(notificationObj)
      resolve()
    }
  })
}

// Close notification function
function buildCloseNotification(notificationWindow, notificationObj, getTimeoutId) {
  return function(event) {
    if (closedNotifications[notificationObj.id]) {
      delete closedNotifications[notificationObj.id]
      return new Promise(function(exitEarly) { exitEarly() })
    } else {
      closedNotifications[notificationObj.id] = true
    }

    if(event == 'btnClose') {
      if (notificationWindow.electronNotifyOnCloseFunc) {
        notificationWindow.electronNotifyOnCloseFunc({
          event: 'close',
          id: notificationObj.id,
          eventDetail: 'btnClose'
        })
        delete notificationWindow.electronNotifyOnCloseFunc
      }
    } else {
      if (notificationWindow.electronNotifyOnCloseFunc) {
        notificationWindow.electronNotifyOnCloseFunc({
          event: event,
          id: notificationObj.id
        })
        delete notificationWindow.electronNotifyOnCloseFunc
      }
    }

    // Hide notification
    notificationWindow.hide()

    // reset content
    notificationWindow.webContents.send('electron-notify-reset')
    if (getTimeoutId && typeof getTimeoutId === 'function') {
      let timeoutId = getTimeoutId()
      clearTimeout(timeoutId)
    }

    // Recycle window
    let pos = activeNotifications.indexOf(notificationWindow)
    activeNotifications.splice(pos, 1)
    activeNotificationsId.splice(pos, 1)
    inactiveWindows.push(notificationWindow)


    checkForQueuedNotifications()

    // Move notifications down
    return moveOneDown(pos)
  }
}

// Always add to animationQueue to prevent erros (e.g. notification
// got closed while it was moving will produce an error)
function buildCloseNotificationSafely(closeFunc) {
  return function(reason) {
    if (reason === undefined)
      reason = 'closedByAPI'
    animationQueue.push({
      func: closeFunc,
      args: [ reason ]
    })
  }
}

ipc.on('electron-notify-close', function (event, winId, notificationObj) {
  let closeFunc = buildCloseNotification(BrowserWindow.fromId(winId), notificationObj)
  buildCloseNotificationSafely(closeFunc)('close')
})

ipc.on('electron-notify-btnClose', function (event, winId, notificationObj) {
  let closeFunc = buildCloseNotification(BrowserWindow.fromId(winId), notificationObj)
  buildCloseNotificationSafely(closeFunc)('btnClose')
})

ipc.on('electron-notify-click', function (event, winId, notificationObj) {
  if (notificationObj.url) {
    electron.shell.openExternal(notificationObj.url)
  }

  let notificationWindow = BrowserWindow.fromId(winId)
  if (notificationWindow && notificationWindow.electronNotifyOnClickFunc) {
    let closeFunc = buildCloseNotification(notificationWindow, notificationObj)
    notificationWindow.electronNotifyOnClickFunc({
      event: 'click',
      id: notificationObj.id,
      closeNotification: buildCloseNotificationSafely(closeFunc)
    })
    delete notificationWindow.electronNotifyOnClickFunc
  }
})

/*
* Checks for queued notifications and add them
* to AnimationQueue if possible
*/
function checkForQueuedNotifications() {
  if (notificationQueue.length > 0 &&
    activeNotifications.length < config.maxVisibleNotifications) {
    // Add new notification to animationQueue
    animationQueue.push({
      func: showNotification,
      args: [ notificationQueue.shift() ]
    })
  }
}

/*
* Moves the notifications one position down,
* starting with notification at startPos
*
* @param  {int} startPos
*/
function moveOneDown(startPos) {
  return new Promise(function(resolve) {
    if (startPos >= activeNotifications || startPos === -1) {
      resolve()
      return
    }
    // Build array with index of affected notifications
    let notificationPosArray = []
    for (let i = startPos; i < activeNotifications.length; i++) {
      notificationPosArray.push(i)
    }
    // Start to animate all notifications at once or in parallel
    let asyncFunc = async.map // Best performance
    if (config.animateInParallel === false) {
      asyncFunc = async.mapSeries // Sluggish
    }
    asyncFunc(notificationPosArray, moveNotificationAnimation, function() {
      resolve()
    })
  })
}

function moveNotificationAnimation(i, done) {
  // Get notification to move
  let notificationWindow = activeNotifications[i]
  // Calc new y position
  let newY = config.lowerRightCorner.y - config.totalHeight * (i + 1)
  // Get startPos, calc step size and start animationInterval
  let startY = notificationWindow.getPosition()[1]
  let step = (newY - startY) / config.animationSteps
  let curStep = 1
  let animationInterval = setInterval(function() {
    // Abort condition
    if (curStep === config.animationSteps) {
      notificationWindow.setPosition(config.firstPos.x, newY)
      clearInterval(animationInterval)
      return done(null, 'done')
    }
    // Move one step down
    notificationWindow.setPosition(config.firstPos.x, startY + curStep * step)
    curStep++
  }, config.animationStepMs)
}

/*
* Find next possible insert position (on top)
*/
function calcInsertPos() {
  if (activeNotifications.length < config.maxVisibleNotifications) {
    nextInsertPos.y = config.lowerRightCorner.y - config.totalHeight * (activeNotifications.length + 1)
  }
}

/*
* Get a window to display a notification. Use inactiveWindows or
* create a new window
* @return {Window}
*/
function getWindow() {
  return new Promise(function(resolve) {
    let notificationWindow
    // Are there still inactiveWindows?
    if (inactiveWindows.length > 0) {
      notificationWindow = inactiveWindows.pop()
      resolve(notificationWindow)
    } else { // Or create a new window
      let windowProperties = config.defaultWindow
      windowProperties.width = config.width
      windowProperties.height = config.height
      notificationWindow = new BrowserWindow(windowProperties)
      notificationWindow.setVisibleOnAllWorkspaces(true)
      notificationWindow.loadURL(getTemplatePath())
      notificationWindow.webContents.on('did-finish-load', function() {
        // Done
        notificationWindow.webContents.send('electron-notify-load-config', config)
        resolve(notificationWindow)
      })
    }
  })
}

function closeAll() {
  // Clear out animation Queue and close windows
  animationQueue.clear()
  _.forEach(activeNotifications, function(window) {
    window.close()
  })
  _.forEach(inactiveWindows, function(window) {
    window.close()
  })
  // Reset certain vars
  nextInsertPos = {}
  activeNotifications = []
  activeNotificationsId = []
  inactiveWindows = []
}

function log() {
  if (config.logging === true) {
    console.log.apply(console, arguments)
  }
}

function updateNoti(id, data) {
  let idx = activeNotificationsId.indexOf(id)
  if(activeNotifications[idx]) {
    if(typeof data === 'number') {
      if (data == 0) {
        return;
      }
      activeNotifications[idx].webContents.send('electron-notify-download-update', data)
    } else if(typeof data === 'string' && data === 'cancelled') {
      activeNotifications[idx].webContents.send('electron-notify-download-update', -1)
    }
  } else {
    //표현되지않는것이니..업데이트 안함.. 할 수가 없어
  }
}

module.exports.notify = notify
module.exports.setConfig = setConfig
module.exports.setDefaultWindowConfig = setDefaultWindowConfig
module.exports.getTemplatePath = getTemplatePath
module.exports.setTemplatePath = setTemplatePath
module.exports.closeAll = closeAll
module.exports.updateNoti = updateNoti

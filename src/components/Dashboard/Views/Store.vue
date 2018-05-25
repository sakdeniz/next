<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-bag"></i> Store</h4>
    <div class="row">
      <div class="ui link cards">
        <div class="card" style="margin:10px;height:400px !important;" v-for="item in getStoreItems(items)">
          <div>
            <center>
              <img style="width:auto;height:150px;" v-if="item.store_item_image!=''" v-bind:src="item.store_item_image" />
              <img v-else style="width:auto;height:150px;" src="static/img/placeholder.png" />
            </center>
          </div>
          <div class="content">
            <div class="header">{{item.store_item_name}}</div>
            <div class="description">
              {{item.store_item_description}}
            </div>
          </div>
          <div class="extra content">
            <span><i class="user icon"></i>{{item.store_item_seller_name}}</span>
          </div>
          <div class="extra content">
            <span class="right floated"><a class="ui purple tag label">{{item.store_item_price}} NAV</a></span>
					<span><button class="ui green button " v-on:click='buy(item)'>Buy</button></button></span>
				</div>
			</div>
          </div>
        </div>
	</div>
</div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";
export default {
  name: "Store",
  components: {},
  computed: {
    ...mapState({
      items: "storeItems",
      buystoreitems: "buyStoreItems",
    })
  },
  created: function() {
    this.StoreItems();
  },
  beforeDestroy() {},
  methods: {
    ...mapActions({
      StoreItems: "getStoreItems",
      BuyStoreItems: "buyStoreItems",
    }),
    buy: function(vitem) {
      let vm = this;
      const {
        value: formValues
      } = swal({
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Buy',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'ui button green',
        cancelButtonClass: 'ui button default',
        buttonsStyling: false,
        reverseButtons: true,
        allowOutsideClick: false,
        html: '<form class="ui form"><h5>Buy</h5><h5>' + vitem.store_item_name + ' (' + vitem.store_item_price + ' NAV)</h5><code>' + vitem.store_item_payment_address + '</code><h4 class="ui dividing header">Shipping Information</h4>' +
          '<div class="fields"><div class="field"><input id="swal-input1" placeholder="Name"></div>' +
          '<div class="field"><input id="swal-input2" placeholder="Surname"></div></div>' +
          '<div class="field"><select id="swal-input3" class="ui dropdown"><option value="">Select Country</option><option value="AF">Afghanistan</option><option value="AX">Åland Islands</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia, Plurinational State of</option><option value="BQ">Bonaire, Sint Eustatius and Saba</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei Darussalam</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos (Keeling) Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CG">Congo</option><option value="CD">Congo, the Democratic Republic of the</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Côte dIvoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CW">Curaçao</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard Island and McDonald Islands</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran, Islamic Republic of</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic Peoples Republic of</option><option value="KR">Korea, Republic of</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Lao Peoples Democratic Republic</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macao</option><option value="MK">Macedonia, the former Yugoslav Republic of</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia, Federated States of</option><option value="MD">Moldova, Republic of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territory, Occupied</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Réunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="BL">Saint Barthélemy</option><option value="SH">Saint Helena, Ascension and Tristan da Cunha</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="MF">Saint Martin (French part)</option><option value="PM">Saint Pierre and Miquelon</option><option value="VC">Saint Vincent and the Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SX">Sint Maarten (Dutch part)</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia and the South Sandwich Islands</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard and Jan Mayen</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Republic</option><option value="TW">Taiwan, Province of China</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania, United Republic of</option><option value="TH">Thailand</option><option value="TL">Timor-Leste</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks and Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="UM">United States Minor Outlying Islands</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela, Bolivarian Republic of</option><option value="VN">Viet Nam</option><option value="VG">Virgin Islands, British</option><option value="VI">Virgin Islands, U.S.</option><option value="WF">Wallis and Futuna</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select></div>' +
          '<div class="field"><input id="swal-input4" placeholder="Address"></div>' +
          '<div class="fields"><div class="field"><input id="swal-input5" placeholder="City"></div>' +
          '<div class="field"><input id="swal-input6" placeholder="State"></div>' +
          '<div class="field"><input id="swal-input7" placeholder="Zip Code"></div></div>' +
          '<div class="fields"><div class="field six"><input id="swal-input8" placeholder="Phone"></div>' +
          '<div class="field seven wide"><input id="swal-input9" placeholder="E-Mail"></div></div>' +
          '<div class="field"><input id="swal-input10" placeholder="Notes"></div>' +
          '</form>',
        focusConfirm: false,
        preConfirm: () => {
          return [document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            $("#swal-input3 option:selected").text(),
            document.getElementById('swal-input4').value,
            document.getElementById('swal-input5').value,
            document.getElementById('swal-input6').value,
            document.getElementById('swal-input7').value,
            document.getElementById('swal-input8').value,
            document.getElementById('swal-input9').value,
            document.getElementById('swal-input10').value
          ]
        }
      }).then(formValues => {
        var error = false;
        var name = formValues["value"][0];
        var surname = formValues["value"][1];
        var country = formValues["value"][2];
        var address = formValues["value"][3];
        var city = formValues["value"][4];
        var state = formValues["value"][5];
        var zipcode = formValues["value"][6];
        var phone = formValues["value"][7];
        var email = formValues["value"][8];
        var notes = formValues["value"][9];
        if (!name || !surname || !country || !address || !city || !state || !zipcode || !phone || !email) {
          error = true;
          swal({
            type: "warning",
            title: "Oops...",
            html: "Please fill all required fields."
          });
        }
        if (!error) {
          var order = {
            store_item_id: vitem.store_item_id,
            store_item_name: vitem.store_item_name,
            store_item_price: vitem.store_item_price,
            store_item_payment_address: vitem.store_item_payment_address,
            name: name,
            surname: surname,
            country: country,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
            phone: phone,
            email: email,
            notes: notes
          };
          swal({
            onOpen: () => {
              swal.showLoading()
            },
            allowOutsideClick: false,
            text: 'Please wait...'
          });
          this.BuyStoreItems(order).then(function(res) {
              console.log(JSON.stringify(vm.buystoreitems));
              if (JSON.stringify(vm.buystoreitems) != "[]") {
                var item = vm.buystoreitems["item"][0];
                if (item.message == "success") {
                  swal({
                    type: "success",
                    title: "Payment Success!",
                    html: "<div style='text-align:left'>" +
                      "Item ID:" + item.id +
                      "<br>Price:" + item.price +
                      "<br>Real Price:" + item.real_price +
                      "<br>Message:" + item.message +
                      "<br>Name:" + item.name +
                      "<br>Surname:" + item.surname +
                      "<br>Address:" + item.address +
                      "<br>Country:" + item.country +
                      "<br>City:" + item.city +
                      "<br>Zip Code:" + item.zipcode +
                      "<br>State:" + item.state +
                      "<br>Phone:" + item.phone +
                      "<br>E-Mail:" + item.email +
                      "<br>Payment Address:<code>" + item.payment_address + "</code>" +
                      "<br>TXID:<code>" + item.txid + "</code>" +
                      "<br>Notes:" + item.notes + "</div>"
                  });
                } else {
                  swal({
                    type: "error",
                    title: "Error",
                    html: "<div style='text-align:left'>" + item.message + "</div>"
                  });
                }
              } else {
                swal({
                  type: "error",
                  title: "Error",
                  html: "<div style='text-align:left'>An error occured while connecting to server...</div>"
                });
              }
            })
            .catch(function(err) {
              swal({
                type: "error",
                title: "Error",
                html: "<div style='text-align:left'>" + err["message"] + "</div>"
              });
            });
        }
      })
    },
    getStoreItems: (items) => {
      return items;
    }
  }
};
</script>
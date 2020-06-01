/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

function setTitleAndContent(btnObj, modalObj, btnName) {
  'use strict';

  var id;
  var modal;

  modal = modalObj;

  if (btnName === null) {
    id = btnObj.id;
  } else {
    id = btnName;
  }

  try {
    modal.getElementsByClassName('holder_body')[0].style.height = 'auto';
  } catch (error1) {
    try {
      modal.getElementsByClassName('form_container')[0].style.height = 'auto';
    } catch (error2) {
      // Do Nothing
    }
  }

  switch (id) {
    case 'item_disclaimer':
      modal.getElementsByClassName('modal_title')[0].innerHTML = 'DISCLAIMER';
      modal.getElementsByClassName('holder_body')[0].innerHTML =
        '<span>MARA London will not be responsible to any damages or losses following the usage of services in this website. All information displayed is true and correct at the time and date it is uploaded and subject to changes from time to time.</span>';
      modal.style.paddingBottom = '0.5em';
      break;

    case 'item_privacy_policy':
      modal.getElementsByClassName('holder_body')[0].style.height = '50vh';
      modal.style.paddingBottom = '1em';

      modal.getElementsByClassName('modal_title')[0].innerHTML = 'PRIVACY POLICY';
      modal.getElementsByClassName('holder_body')[0].innerHTML =
        "<div class='sub_header'><span>Information Collected</span></div>" +
        '<span>We may collect information about you when you actively interact with our Website, for example when you contact us for further information, or take part in any of our online or digital initiatives.</span></br>' +
        '</br>' +
        '<span>We may collect your personal data which you voluntarily provide to us through our Website such as your name, your contact information such as your address, email address, telephone number, information which is collected from you automatically such as your log-in information, browser type, operating system, and URL information, and such other information depending on the purpose of your visit to our Website.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Link to Other Websites</span></div>" +
        '<span>This portal has link to other Government and non-government Agencies. The privacy policy is only applicable to this Portal. It should be noted that this Portal may have a different privacy policy and visitors are advised to study and understand the privacy policies for every website visited.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Amendment on the Policy</span></div>" +
        '<span>Should there be any amendment made to the privacy policy, it will be updated in this page. If you are a regular visitor to this Portal, you will be kept updated with information collected, on how you can apply it and in certain circumstances how to share the information with others.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Notification</span></div>" +
        '<span>Majlis Amanah Rakyat (MARA) London respects your privacy and strive to protect your personal data in accordance with the provisions of the Personal Data Protection Act 2010 (“Act 709”), which has been in force.</span></br>';
      break;

    case 'btn_about':
      modal.getElementsByClassName('holder_body')[0].style.height = '70vh';
      modal.style.paddingBottom = '1em';
      break;

    case 'btn_signup':
      // Do Nothing
      break;

    case 'btn_contact':
      // Do Nothing
      break;

    case 'item_tnc':
      modal.getElementsByClassName('holder_body')[0].style.height = '50vh';
      modal.style.paddingBottom = '1em';

      modal.getElementsByClassName('modal_title')[0].innerHTML = 'TERMS AND CONDITIONS';
      modal.getElementsByClassName('holder_body')[0].innerHTML =
        '<span>The following are the terms and conditions for the use of this web portal as well as the rights and responsibilities while accessing and/or using the services provided on this website.</span></br>' +
        '</br>' +
        '<span>Choosing to access this web portal serves affirms that you have agreed to be bound by the terms and conditions provided thus constituting an agreement between you, as the user of this web portal, and us.</span></br>' +
        '</br>' +
        '<span>These new terms and conditions will automatically revoke all previous terms and conditions that you have accepted or accessed through this web portal. Subsequent use and/or access to the web portal will be considered as an acceptance of these terms and conditions.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Exclusions and Limitations</span></div>" +
        '<span>Please take note that you hereby understand and accept that we shall not be responsible or liable for damages arising out of or in connection with your use of this website, direct or indirect, consequential or exemplary. This includes, without limitation to loss of profits, loss of trust or nominal damages arising out of:</span></br>' +
        '</br>' +
        '<span>(1) The use or inability to use of this service; (2) costs for attaining goods and substituted services in the purchase of any goods, data, information or services or messages received or any transactions made through this website; (3) access without permission or changes in delivery or your data; (4) representations made by a third party through this website; or (5) anything related to this web portal.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Links</span></div>" +
        '<span>We may provide links to other websites which are owned and monitored by third parties and therefore not within our access. You shall hereby acknowledge and agree that the content, advertisements, products or any other materials appearing on such websites are not endorsed or supported by us. You shall also acknowledge and agree that we shall not be responsible and liable for damages or losses arising out of or in connection with the use or reliance on its contents, goods or services provided through such website or source.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Termination</span></div>" +
        '<span>We are authorized to end your access to the whole or any part of the service and any other related services at any time with or without cause, whether notified or not, effective immediately. We are also authorized to terminate or suspend an inactive account. An inactive account is an account which has not been logged in or utilized for a certain period of time. You hereby acknowledge that we will not be liable to you or any third party in the event access to the services provided has been terminated.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Changes to the Terms of Services</span></div>" +
        '<span>We are authorized to make amend, modify, cancel or add to the terms and conditions from time to time by giving prior notice. However, in the event of an emergency or for the safety of the website or in any event beyond our control where amendments, modifications, cancellations or additions are necessary, we may do so without prior notification. It is agreed thereon that you shall access and re-read these terms and conditions on a regular basis to check for the latest amendments, modifications, cancellations or additions. You shall thereby acknowledge and accept that continuous access and the use of these terms and conditions (changed or modified from time to time) shall amount to the acceptance of any amendments, modifications, cancellations or additions to the terms and conditions.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>Modification of Services</span></div>" +
        '<span>We are empowered to modify or terminate the services (or any part of the service) either temporarily or permanently at any time whether with or without notice. You shall hereby agree that we shall not be liable for the modifications, suspension or termination of services affecting you or any third party.</span></br>' +
        '</br>' +
        "<div class='sub_header'><span>General</span></div>" +
        '<span>The above headings are for reference only and will not be taken into account in defining the terms and conditions.</span></br>' +
        '</br>' +
        '<span>If any of these allocations of terms are deemed invalid or unenforceable under the law or any current or future regulations, the allocated term shall be separated and these terms shall be deemed severed and the remaining terms will continue to apply.</span></br>';
      break;

    default:
      // Do Nothing
      break;
  }
}

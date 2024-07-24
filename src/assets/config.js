// By default, Klaro will load the config from  a global "klaroConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="klaro.js" data-config="myConfigVariableName" />
var klaroConfig = {
  // With the 0.7.0 release we introduce a 'version' paramter that will make
  // it easier for us to keep configuration files backwards-compatible in the future.
  version: 1,

  // You can customize the ID of the DIV element that Klaro will create
  // when starting up. If undefined, Klaro will use 'klaro'.
  elementID: 'klaro',

  // You can override CSS style variables here. For IE11, Klaro will
  // dynamically inject the variables into the CSS. If you still consider
  // supporting IE9-10 (which you probably shouldn't) you need to use Klaro
  // with an external stylesheet as the dynamic replacement won't work there.
  styling: {
    theme: ['light', 'top', 'wide'],
  },

  // You can show a description in contextual consent overlays for store
  // being empty. In that case the accept always button is omitted.
  // The description contains a link for opening the consent manager.
  showDescriptionEmptyStore: true,

  // Setting this to true will keep Klaro from automatically loading itself
  // when the page is being loaded.
  noAutoLoad: false,

  // Setting this to true will render the descriptions of the consent
  // modal and consent notice are HTML. Use with care.
  htmlTexts: true,

  // Setting 'embedded' to true will render the Klaro modal and notice without
  // the modal background, allowing you to e.g. embed them into a specific element
  // of your website, such as your privacy notice.
  embedded: false,

  // You can group services by their purpose in the modal. This is advisable
  // if you have a large number of services. Users can then enable or disable
  // entire groups of services instead of having to enable or disable every service.
  groupByPurpose: true,

  // You can make the consent notice autofocused by enabling the following option
  autoFocus: false,

  // You can show a title in the consent notice by enabling the following option
  showNoticeTitle: false,

  // How Klaro should store the user's preferences. It can be either 'cookie'
  // (the default) or 'localStorage'.
  storageMethod: 'cookie',

  // You can customize the name of the cookie that Klaro uses for storing
  // user consent decisions. If undefined, Klaro will use 'klaro'.
  cookieName: 'klaro',

  // You can also set a custom expiration time for the Klaro cookie.
  // By default, it will expire after 120 days.
  cookieExpiresAfterDays: 365,

  // You can change to cookie domain for the consent manager itself.
  // Use this if you want to get consent once for multiple matching domains.
  // If undefined, Klaro will use the current domain.
  //cookieDomain: '.github.com',

  // You can change to cookie path for the consent manager itself.
  // Use this to restrict the cookie visibility to a specific path.
  // If undefined, Klaro will use '/' as cookie path.
  //cookiePath: '/',

  // Defines the default state for services (true=enabled by default).
  default: false,

  // If "mustConsent" is set to true, Klaro will directly display the consent
  // manager modal and not allow the user to close it before having actively
  // consented or declines the use of third-party services.
  mustConsent: false,

  // Show "accept all" to accept all services instead of "ok" that only accepts
  // required and "default: true" services
  acceptAll: true,

  // replace "decline" with cookie manager modal
  hideDeclineAll: false,

  // hide "learnMore" link
  hideLearnMore: false,

  // show cookie notice as modal
  noticeAsModal: true,

  // You can also remove the 'Realized with Klaro!' text in the consent modal.
  // Please don't do this! We provide Klaro as a free open source tool.
  // Placing a link to our website helps us spread the word about it,
  // which ultimately enables us to make Klaro! better for everyone.
  // So please be fair and keep the link enabled. Thanks :)
  disablePoweredBy: true,

  // you can specify an additional class (or classes) that will be added to the Klaro `div`
  //additionalClass: 'my-klaro',

  // You can define the UI language directly here. If undefined, Klaro will
  // use the value given in the global "lang" variable. If that does
  // not exist, it will use the value given in the "lang" attribute of your
  // HTML tag. If that also doesn't exist, it will use 'en'.
  lang: 'pl',
  // This is a list of third-party services that Klaro will manage for you.
  services: [
    {
      name: 'functional',
      purposes: ['functional'],
      default: true,
      optOut: true,
      required: true,

    },
    {
      name: 'analytics',
      default: false,
      purposes: ['analytics'],

    },
    {
      name: 'marketing',
      default: false,
      purposes: ['marketing'],

    },
    {
      name: 'others',
      default: false,
      purposes: ['others'],
      table: null,
    },
  ],
  callback: function(consent, service) {

  },
};


function initComplianceSettings() {
  function getComplianceSettings() {
    ppms.cm.api('getComplianceSettings', function(settings) {
      console.log('Current compliance settings:', settings);
    }, function(error) {
      console.error('Error getting compliance settings:', error);
    });
  }

  // Retrieve compliance settings on page load
  getComplianceSettings();

  /*
  [
  'analytics',
  'ab_testing_and_personalization',
  'custom_consent',
  'user_feedback',
  'marketing_automation',
  'remarketing',
  'conversion_tracking'
  ]
   */

  const consentMapping = {
    'functional': 'custom_consent',
    'analytics': 'analytics',
    'marketing': 'marketing_automation',
    'others': 'conversion_tracking',
  };


  let manager = klaro.getManager() // get the consent manager
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function createButton() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('js-klaro-container');

    const button = document.createElement('button');
    button.classList.add('js-klaro-button');
    button.textContent = 'Polityka cookies';
    button.setAttribute('onClick', 'klaro.show(undefined, true);return false;');

    wrapper.appendChild(button);
    document.body.appendChild(wrapper);
  }

  const cookieName = 'klaro';
  if (getCookie(cookieName)) {
    createButton();
  }
  document.addEventListener('click', function(event) {
    const buttonSelectors = ['.cm-footer-buttons button', '.cn-ok button', '.cn-ok a'];
    for (const selector of buttonSelectors) {
      if (event.target.matches(selector)) {
        if (!document.querySelector('.js-klaro-container')) {
          createButton();
        }
        break;
      }
    }
  });
  manager.watch({
    update: function(manager, eventType, data) {
      if (eventType === 'saveConsents') {
        console.log(eventType);
        console.log(data.consents);

        // Prepare consent settings for Piwik Pro API
        let consents = {};
        for (let service in data.consents) {
          if (consentMapping.hasOwnProperty(service)) {
            consents[consentMapping[service]] = { status: data.consents[service] ? 1 : 0 };
          }
        }
        console.log(consents);
        // Inform Piwik Pro API about the user choice
        ppms.cm.api('setComplianceSettings', { consents: consents }, function() {
          console.log('Consent settings saved successfully.');
        }, function(error) {
          console.error('Error saving consent settings:', error);
        });
      }
    }
  });
};
function waitForKlaro(callback) {
  if (typeof klaro !== 'undefined') {
    callback();
  } else {
    setTimeout(function() {
      waitForKlaro(callback);
    }, 100);
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    waitForKlaro(initComplianceSettings);
  });
} else {
  waitForKlaro(initComplianceSettings);
}

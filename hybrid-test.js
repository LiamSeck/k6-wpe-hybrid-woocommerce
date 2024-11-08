import { base_url } from './config.js';
import { browser } from 'k6/browser';
import { check } from 'k6';
import { sleep } from 'k6';
import { navigateHomepage } from "./navigateHomepage.js";
import { addToCart } from "./addToCart.js";
import { navigateToCart } from "./navigateToCart.js";
import { navigateToCheckout } from "./navigateToCheckout.js";
import { updateAddress } from "./updateAddress.js";
import { submitCheckout } from "./submitCheckout.js";

export const options = {
// K6 bills in VUh 
// (Maximum number of VUs x test execution duration in minutes) / 60 minutes = VUh
// E.g (10 VUs x 5 mins)/60 = 0.83 VUh

// K6 Cloud Config
  cloud: {
    // Project: WPE WooCommerce Load Testing
    projectID: 3717362,
    // Test runs with the same name groups test runs together.
    name: 'Hybrid Load Testing of https://liamseprod.wpenginepowered.com/',
    // Adding Load Zone so that traffic routes from amazon:gb:london over the default location
    distribution: {
      AWSLondon: { loadZone: 'amazon:gb:london', percent: 100 },
    },
  },
  // Defining test scenarios for protocol level and browser level load test
  scenarios: {
    // Protocol Level Test Config
    ProtocolLevelScenario: {
      exec: 'backendLoad',
      executor: 'constant-vus',
        vus: 1,
        duration: "1m",
    },
    // Browser Level Test Config
    BrowserCheckOutScenario: {
        exec: 'checkFrontend',
        executor: 'constant-vus',
        vus: 1,
        duration: "2m",   
        options: {
          browser: {
            type: 'chromium', 
        },
      },
    },
  },

  // Define test thresholds for both protocol and browser based load tests 
  thresholds: {
    // Protocol Level Thresholds
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],

    // Browser Level Thresholds based on Core Web Vitals: https://web.dev/articles/defining-core-web-vitals-thresholds 
    browser_web_vital_lcp: ['p(75) < 2500'],
    browser_web_vital_inp: ['p(75) < 200'],
    browser_web_vital_cls: ['p(75) < 0.1'],
    browser_web_vital_fcp: ['p(95) < 1800'],
    browser_web_vital_ttfb: ['p(95) < 800'],
  },
};

// used to store global variables
globalThis.vars = [];
// global min/max sleep durations (in seconds):
globalThis.pauseMin = 2;
globalThis.pauseMax = 5;

export async function backendLoad() {
  // Executes requests defined in navigateHomepage()
  navigateHomepage();
  // Executes requests defined in addToCart()
  addToCart();
  // Executes requests defined in navigateToCart()
  navigateToCart(); 
  // Executes requests defined in
  navigateToCheckout();
  // Executes requests defined in navigateToCheckout()
  updateAddress();
  // Executes requests defined in submitCheckout()
  submitCheckout();
}


export async function checkFrontend() {
    // Initiate a new browser
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go to homepage
    await page.goto(`https://${base_url}/`);
    page.screenshot({ path: 'screenshots/1_homepage.png' });
    sleep(3);

    // Go to product page
    await page.goto(`https://${base_url}/products/`);
    sleep(3);
    page.screenshot({ path: 'screenshots/2_productspage.png' });

    // Click on first product on product page https://liamseprod.wpenginepowered.com/products/ 
    const ClickOnProduct = page.locator('//*[@id="genesis-content"]/article/div/div/ul/li[1]/a[1]/img');
    await Promise.all([page.waitForNavigation(), ClickOnProduct.click()]);
    sleep(3);
    page.screenshot({ path: 'screenshots/3_AllProducts.png' });

    // Click Add to Basket on https://liamseprod.wpenginepowered.com/product/test-prod-one/
    const AddToBasket = page.locator('//*[@id="product-47"]/div[2]/form/button');
    await Promise.all([page.waitForNavigation(), AddToBasket.click()]);
    sleep(3);
    page.screenshot({ path: 'screenshots/4_ClickAddToCart.png' });

    // View Basket https://liamseprod.wpenginepowered.com/cart/
    const viewBasket = page.locator('//*[@id="genesis-content"]/div[1]/div/a');
    await Promise.all([page.waitForNavigation(), viewBasket.click()]);
    sleep(3);
    page.screenshot({ path: 'screenshots/5_ViewBasket.png' });

    // Proceed to Checkout https://liamseprod.wpenginepowered.com/checkout/
    const proceedToCheckout = page.locator('//*[@id="genesis-content"]/article/div/div/div[2]/div/div/a');
    await Promise.all([page.waitForNavigation(), proceedToCheckout.click()]);
    sleep(3);
    page.screenshot({ path: 'screenshots/6_ClickProceedToCheckout.png' });

    // Enter Shipping Information
    page.locator('input[name="billing_first_name"]').type('Headless');
    sleep(.1);
    page.locator('input[name="billing_last_name"]').type('Chrome Browser');
    // sleep(.1);
    //page.locator('input[name="billing_country"]').type('United Kingdom (UK)');
    sleep(.1);
    page.locator('input[name="billing_address_1"]').type('HEADLESS-TEST-HOUSE, HEADLESS-TEST-PLACE');
    sleep(.1);
    page.locator('input[name="billing_city"]').type('HEADLESS-TEST-CITY');
    sleep(.1);
    page.locator('input[name="billing_state"]').type('');
    sleep(.1);
    page.locator('input[name="billing_postcode"]').type('AA901XX');
    sleep(.1);
    page.locator('input[name="billing_phone"]').type('0000000000');
    sleep(.1);
    page.locator('input[name="billing_email"]').type('test@test.com');
    page.screenshot({ path: 'screenshots/7_Shipping_Info.png' });

    // Click on the place order button
    const placeOrderButton = page.locator('//*[@id="place_order"]');
    placeOrderButton.click();
    //await Promise.all([page.waitForNavigation(), placeOrderButton.click()]);
    page.screenshot({ path: 'screenshots/8_Order_Placed.png'});
    sleep(5);
    // Close the browser
    await page.close();
  }
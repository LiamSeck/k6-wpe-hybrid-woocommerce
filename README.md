[![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white)](https://github.com/grafana/k6)![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)

# K6 Hybrid Performance Testing of WooCommerce

## Overview

This repo contains an example [hybrid](https://grafana.com/docs/k6/latest/using-k6-browser/recommended-practices/hybrid-approach-to-performance/) performance load test simulating a full checkout flow against a WooCommerce installation hosted on WPE: https://liamseprod.wpenginepowered.com/. 


The code in this repo combines a browser and HTTP protocol level test in a single script. The script runs a protocol level load test and also spins up a Chromium based browser to check the frontend for any unexpected usability issues throughout the checkout flow while the system is under load. 


### Execution Steps

- To execute the test using your local machines resources run:

```
k6 run hybrid-test.js
``` 

- K6 browser tests run in a headless browser by default. To disable this and to see the Chrome browser open add the complete the steps defined in `checkFrontend()` function defined in `hybrid-test.js` add the  `K6_BROWSER_HEADLESS=false` flag:

```
K6_BROWSER_HEADLESS=false k6 run hybrid-test.js
```

- To execute the test using K6 Cloud run:

```
k6 cloud run hybrid-test.js
```  
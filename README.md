[![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white)](https://github.com/grafana/k6)![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)

# K6 Hybrid Performance Testing of WooCommerce

## Overview

This repo contains an example hybrid performance load test simulating a full checkout flow against a WooCommerce installation hosted at WPE: https://liamseprod.wpenginepowered.com/. 


The code in this repo combines a browser and HTTP protocol level test in a single script. The script runs a protocol level load test and also spins up a real chromium based browser to check the frontend for any unexpected usability issues throughout the checkout flow while the system is under load. 


### Execution Steps

```
K6_BROWSER_HEADLESS=false k6 run hybrid-test.js
```  

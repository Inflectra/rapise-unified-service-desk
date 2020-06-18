# rapise-unified-service-desk

Framework for testing Microsoft Dynamics 365 Unified Service Desk.

- Reusable functions are defined in `User.js`.
- Data for each test case is defined in `Data.xlsx`.
- `Dropdowns.xlsx` contains lists of values for [RVL dropdowns](https://rapisedoc.inflectra.com/Guide/rvl_editor/#param-dropdowns).
- `Output.xlsx` is used to persist data between test executions (see SetOutputValue, GetOutputValue common functions below).
 
The way of test parameterization and reading data from an Excel spreadsheet is described in the docs:

[Data-Driven Testing](https://rapisedoc.inflectra.com/Guide/ddt/)

## Browser Profiles

The framework includes a [local browser profile](https://rapisedoc.inflectra.com/Guide/browser_settings/#local-browser-profiles) located in `Profiles\BrowserProfiles` folder. It is a profile for Chrome. The profile to use is specified in `User.js` file and is used globally by all test cases:

```javascript
g_browserLibrary = "UnifiedServiceDesk_IE";
```

You may change the profile in `User.js` or pass `g_browserLibrary` value from SpiraTest or via command line.

## Common Functions

All functions are defined in [User.js](User.js). Look into this file for details.

## USDLaunch

Launches USD desktop client.

### USDClose

Closes USD desktop client.


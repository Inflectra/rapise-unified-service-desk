# rapise-unified-service-desk

Framework for testing Microsoft Dynamics 365 Unified Service Desk.

- Reusable functions are defined in `User.js`.
- Data for each test case is defined in `Data.xlsx`.
- `Dropdowns.xlsx` contains lists of values for [RVL dropdowns](https://rapisedoc.inflectra.com/Guide/rvl_editor/#param-dropdowns).
- The framework also includes functions from [rapise-dynamics365-crm](https://github.com/Inflectra/rapise-dynamics365-crm)
 
The way of test parameterization and reading data from an Excel spreadsheet is described in the docs:

[Data-Driven Testing](https://rapisedoc.inflectra.com/Guide/ddt/)

## Browser Profiles

The framework includes [local browser profiles](https://rapisedoc.inflectra.com/Guide/browser_settings/#local-browser-profiles) located in `Profiles\BrowserProfiles` folder. It is a profile for Chrome. The profile to use is specified in `User.js` file and is used globally by all test cases:

- UnifiedServiceDesk_IE - for connecting to IE hosted controls.
- Selenium - Chrome - for connecting to Chrome hosted controls.
- ChromeWeb - for connecting to Chrome browser.

## Unified Service Desk Instances

You may change the instance in `User.js` or pass `g_usdInstance` value from SpiraTest or via command line. The instance name is used by `zConfig` function to set `g_browserLibrary` and `g_usdConfigPath`.

`g_usdConfigPath` references an Excel file that must contain properties

- OnlineRegion
- UserName
- Password
- OrganizationName

Use `Config.xlsx` as a template.

## Common Functions

All functions are defined in [User.js](User.js). Look into this file for details.

### USDLaunch

Launches Unified Service Desk application and calls `USDLogin`.

### USDLogin

Logs into Unified Service Desk application. `g_usdConfigPath` points to a config file with USD instance credentials.

### USDClose

Closes Unified Service Desk application.

### USDSetRichText

Sets text into a rich editor. Learn more in this [KB](https://www.inflectra.com/Support/KnowledgeBase/KB541.aspx).

### USDSelectWindow

Attaches to a Chrome hosted control based on URL/Title match or index.

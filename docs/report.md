# Programming Proof of Concept Report

## Introduction

The Programming Proof of Concept (PoC) was developed to demonstrate the feasibility of building a case programming system for the Planning Inspectorate. The PoC provides a simple web application that allows users to create and view cases, assign cases to inspectors, and view the details of a case.

## Functionality

### Case list

The PoC provides a list of cases arranged in a table. The list displays:

- Case reference
- Case type
- Procedure
- Band
- Level
- Location
- LPA
- Region
- Case status
- Case age ('weeks')
- Linked cases
- Final comments date
- Programming status

There are also checkboxes to select cases for assignment and a checkbox at the top to select all cases.

#### Inspector selection

There is a dropdown to select an inspector from a predefined list of inspectors. The PoC uses a hardcoded list of inspectors, with real user IDs for integration with the Microsoft Graph API.

After choosing an inspector from the dropdown, users can select the inspector. Selecting the inspector will reload the case list with a selection of filters that are appropriate for that inspector.

#### Filtering

Cases in the case list can be filtered by:

- Case age
- Procedure
- LPA region
- Case type
- Specialism
- Specialism code

#### Sorting

There are three sort mechanisms:

- Case age (default)
- Distance from inspector
- Hybrid

The hybrid sort uses a weighted algorithm to prioritize cases based on their age and distance from the inspector.

To achieve this, cases are put into two lists; one sorted by age the other by distance. A combined score for each case is then determined by its position in the list:

```
score = (age_position * age_weight) + (distance_position * distance_weight)
```

Then the cases are sorted by score, smallest is best.

Increasing the input weights will increase the importance of that factor in the sort by increasing impact of appearing further down the list in that category.

#### Page size and pagination

The case list uses the GOV.UK frontend pagination component to allow users to navigate between pages.

The page size can be set to 5, 10, 12 or 15.

### Case map

The Map tab on the home page displays the cases returned by the filter in a map view.

Each case on the map can be selected to show a modal with the case details.

The inspector is shown on the map with a person icon.

The map is centered on the average position of all cases.

Case markers are colour coded to indicate age of the case, ranging from red/pink (older cases) to green (new cases)

### Case assignment

Users can assign a case to an inspector by selecting one or more cases from the case list, choosing an assignment date and pressing "Assign selected cases".

#### Email notification

The inspector will be emailed the list of cases that have been assigned to them.

#### Calendar events

Three events will be added to the inspectors calendar per case:

- Planning
- Site visit
- Report

Each event will be programmed on a different day of the week for the week of the input assignment date.

- Planning on Monday
- Site visit on Tuesday
- Report on Wednesday

Each event is four hours long and there is a maximum of two events on a single day.

When more than two cases have been selected, events will be added to the calendar on the next week.

#### Case pairing

Cases are paired together by selecting the oldest case first, then pairing it with another case using a weighted algorithm to score other cases based on their age and distance from the first case. This tries to avoid situations where the inspector would have to travel large distances between two site visits on the same day.

### Case details

The case details page shows the details of a single case and a map showing the location of the case in relation to the inspector.

The case details include:

- Case Number
- Site Address
- Job Details
- Procedure
- Jurisdiction
- Case Status
- Band
- Case Level
- Special Circumstances
- Costs Applied For
- Local Planning Authority
- Agent
- Appellant
- Case Officer
- EO Responsible
- LPA Phone
- Agent Phone
- Appellant Phone
- Case Officer Phone
- EO Phone
- Appeal Start Date
- Target Date
- Rosewell Target
- Personal Target Date
- Charting Notes
- Event Type
- Event Date
- Event Status
- Duration
- Venue

### Inspector details

The inspector details tab ('inspector' tab on home view) shows the details of a single inspector and a view of the inspector's calendar ('inspector calendar' tab on home view) with event details

The inspector details include:

- Address
- Work Phone
- Mobile Phone
- Resource Group
- Grade
- FTE
- Charting Officer
- Charting Officer Phone
- Inspector Manager
- Name
- Proficiency
- Valid From
- Specialisms

#### Inspector calendar

The user must have access to the inspectors calendar in order to view it.

The calendar tab will give a view of the inspectors week and users can cycle through each week.

## Technical implementation

The PoC was developed using the Planning Inspectorate technical stack: Node.js, express.js and nunjucks.

The user interface was built using the GOV.UK Design System, which provides a set of styles and components that are designed to be accessible and easy to use.

Where possible the Planning Inspectorate technical standards were followed, but it should be noted that the code quality, formatting and technical approach were not priorities for the PoC and may fall short of some of the Planning Inspectorate standards.

## Integrations

Single Sign On is provided by an OAuth2 implementation connected to the Planning Inspectorate's Entra ID.

The mapping functionality is provided by the Ordnance Survey API.

Gov Notify is used to send email notifications to users.

Microsoft Graph API is used to create Outlook calendar events for case assignments.

## Gaps, limitations and known issues

### Data

The PoC makes extensive use of mock data that has been hardcoded into the application. This data is mapped out in [docs/data.md](/docs/data.md) and includes it's future source or whether it needs to be created.

Some examples include: regions not existing and linked cases only being available to child cases.

The inspector filters are hardcoded and should be derived from their specialisms and preclusions.

### User interface

The user interface was shown to an Interaction Designer and feedback was incorporated. However, the user interface is indicative only and would need to be redesigned and tested with real users.

The user interface has not been tested for accessibility will likely have issues.

### Testing

There are some unit tests for the backend code, but no end-to-end tests. It is assumed that any future work would not use the PoC codebase and would be a fresh start.

The PoC has not been tested for performance or scalability.

### Feature gaps

The list of inspectors only shows a small group of hardcoded inspectors. If the programmer had a large number of inspectors in their group or wanted to see a complete list, they may need a different UI pattern.

The Graph API call to retrieve an inspectors calendar is capped at 999 events. This could be an issue if the inspector has a large number of events in their calendar.

When creating calendar events for case assignment the inspectors calendar is not loaded so there is no way to check for conflicts.

## Future work

A standard productionization process would be followed to take the PoC to a production-ready state. This would include:

- User interface redesign, complete with accessibility testing
- A re-write with more robust code and automated testing
- Integration with real data sources
- Security and performance testing
- Documentation

### Integrations

As outlined in the [data sources](/docs/data.md) document, it will be necessary to integrate with a number of external systems to provide real data. This would include:

- CBOS for cases
- SAP for inspector details

### Features and enhancements

The case age should be two separate fields: minimum and maximum. This would allow users to filter cases that are older than a certain age, or between two ages.

The case assignment does not currently check for existing events in an inspectors calendar when creating events. It would be possible to modify the algorithm to plan around existing events. In addition to this, it always assumed that four hours is needed per event, but there are cases where the duration may vary and this needs to be taken into account.

When viewing the map on the case list, tt may be helpful to create a [distance matrix](https://pro.arcgis.com/en/pro-app/latest/tool-reference/ready-to-use/itemdesc-generateorigindestinationcostmatrix.htm) to calculate the distance between cases and inspectors.

Showing driving directions might be useful on the map tab when the distance as the crow flies is different to the distance required to get there by road.

At the moment case assignment is done in the context of a single inspector. Where multiple inspectors are working in the same area it may be useful to develop an algorithm that allocates cases to the most appropriate inspector based on their location and specialisms.

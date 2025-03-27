# Data sources

The data for cases and inspectors used in this proof of concept comes from various sources. Some does not exist yet and others are unclear.

## Case data

| Field Name                     | Source             | Notes                                                                                                      |
| ------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Case reference                 | CBOS API           |                                                                                                            |
| Case type                      | CBOS API           |                                                                                                            |
| Procedure                      | CBOS API           |                                                                                                            |
| Band                           | CBOS API           |                                                                                                            |
| Level                          | CBOS API           |                                                                                                            |
| Site Address                   | CBOS API           |                                                                                                            |
| Location                       | OS API             | lat/long from OS API using site address postcode, should we be using UPRN to get a more accurate location? |
| Local Planning Authority (LPA) | CBOS API           | lpd in CBOS API                                                                                            |
| Region                         | N/A                | doesn't exist yet, but could be from a reference list                                                      |
| Case status                    | CBOS API           |                                                                                                            |
| Case age                       | CBOS API           | calculated in weeks from the valid date in CBOS API                                                        |
| Linked cases                   | CBOS API           | leadCaseReference from CBOS API if the case is a child case, but not a sibling                             |
| Final comments date            | N/A                | doesn't exist yet                                                                                          |
| Programming status             | CBOS API           |                                                                                                            |
| Job Details                    | CBOS API           |                                                                                                            |
| Jurisdiction                   | N/A                | don't think this exists                                                                                    |
| Special Circumstances          | N/A                | don't think this exists                                                                                    |
| Costs Applied For              | N/A                | work in progress, but doesn't exist yet                                                                    |
| Agent                          | CBOS API           |                                                                                                            |
| Appellant                      | CBOS API           |                                                                                                            |
| Case Officer                   | CBOS API           |                                                                                                            |
| EO Responsible                 | N/A                | not sure on this one, ask Matt                                                                             |
| LPA Phone                      | N/A                | don't have it                                                                                              |
| Agent Phone                    | CBOS API           |                                                                                                            |
| Appellant Phone                | CBOS API           |                                                                                                            |
| Case Officer Phone             | SAP API            |                                                                                                            |
| EO Phone                       | N/A                | not sure on this one, ask Matt                                                                             |
| Appeal Start Date              | CBOS API           | appeal start date or valid date?                                                                           |
| Target Date                    | CBOS API           | derived from the valid date, might need a reference table                                                  |
| Rosewell Target                | N/A                | may not exist anymore                                                                                      |
| Personal Target Date           | N/A                | not in CBOS, not sure where                                                                                |
| Charting Notes                 | Programming system |                                                                                                            |
| Event Type                     | CBOS API           | some information from CBOS, but not sure we should combine site visit with procedure types                 |
| Event Date                     | CBOS API           | same                                                                                                       |
| Event Status                   | CBOS API           | same                                                                                                       |
| Duration                       | CBOS API           | same                                                                                                       |
| Venue                          | CBOS API           | same                                                                                                       |

## Inspector data

| Field Name             | Source             | Notes |
| ---------------------- | ------------------ | ----- |
| Address                | SAP API            |       |
| Work Phone             | SAP API            |       |
| Mobile Phone           | SAP API            |       |
| Resource Group         | SAP API            |       |
| Grade                  | SAP API            |       |
| FTE                    | SAP API            |       |
| Charting Officer       | programming system |       |
| Charting Officer Phone | SAP API            |       |
| Inspector Manager      | SAP API            |       |
| Name                   | SAP API            |       |
| Proficiency            | SAP API            |       |
| Valid From             | SAP API            |       |
| Specialisms            | SAP API            |       |

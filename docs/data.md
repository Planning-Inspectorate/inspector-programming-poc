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
| Site address                   | CBOS API           |                                                                                                            |
| Location                       | OS API             | lat/long from OS API using site address postcode, should we be using UPRN to get a more accurate location? |
| Local Planning Authority (LPA) | CBOS API           | lpd in CBOS API                                                                                            |
| Region                         | N/A                | doesn't exist yet, but could be from a reference list                                                      |
| Case status                    | CBOS API           |                                                                                                            |
| Case age                       | CBOS API           | calculated in weeks from the valid date in CBOS API                                                        |
| Linked cases                   | CBOS API           | leadCaseReference from CBOS API if the case is a child case, but not a sibling                             |
| Final comments date            | N/A                | doesn't exist yet                                                                                          |
| Programming status             | Programming system | New field                                                                                                  |
| Programming notes              | Programming system | New field                                                                                                  |
| Job details                    | CBOS API           |                                                                                                            |
| Jurisdiction                   | N/A                | don't think this exists                                                                                    |
| Special circumstances          | N/A                | don't think this exists                                                                                    |
| Costs applied for              | N/A                | work in progress, but doesn't exist yet                                                                    |
| Agent                          | CBOS API           |                                                                                                            |
| Appellant                      | CBOS API           |                                                                                                            |
| Case officer                   | CBOS API           |                                                                                                            |
| LPA phone                      | N/A                | don't have it                                                                                              |
| Agent phone                    | CBOS API           |                                                                                                            |
| Appellant phone                | CBOS API           |                                                                                                            |
| Case Officer phone             | SAP API            |                                                                                                            |
| Appeal start dte               | CBOS API           |                                                                                                            |
| Valid date                     | CBOS API           |                                                                                                            |
| Event type                     | CBOS API           | some information from CBOS, but not sure we should combine site visit with procedure types                 |
| Event date                     | CBOS API           | same                                                                                                       |
| Event status                   | CBOS API           | same                                                                                                       |
| Duration                       | CBOS API           | same                                                                                                       |
| Venue                          | CBOS API           | same                                                                                                       |

## Inspector data

| Field Name             | Source             | Notes     |
| ---------------------- | ------------------ | --------- |
| Address                | SAP API            |           |
| Work Phone             | SAP API            |           |
| Mobile Phone           | SAP API            |           |
| Resource Group         | SAP API            |           |
| Grade                  | SAP API            |           |
| FTE                    | SAP API            |           |
| Charting Officer       | Programming system | New field |
| Charting Officer Phone | SAP API            |           |
| Inspector Manager      | SAP API            |           |
| Name                   | SAP API            |           |
| Proficiency            | SAP API            |           |
| Valid From             | SAP API            |           |
| Specialisms            | SAP API            |           |

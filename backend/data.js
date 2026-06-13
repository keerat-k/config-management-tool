const workflows = [
  {
    id: 1,
    workflowId: "WF-001",
    workflowCategory: "Ingestion",
    workflowName: "Load Daily Production Data",
    businessUnit: "Upstream",
    facility: "San Ramon Refinery",
    payload: "production_daily_v2",
    steps: [
      {
        stepId: "S-001",
        stepName: "Ingest Raw CSV",
        dataOperation: "Ingest",
        dataset: "DS-RAW-001",
        dataset1Name: "production_raw",
        operationSpecificInfo: "Source: SFTP /data/production/*.csv",
        dataset2Name: null,
        outputParameters: null,
        order: 1
      },
      {
        stepId: "S-002",
        stepName: "Add Facility Column",
        dataOperation: "AddCol",
        dataset: "DS-RAW-001",
        dataset1Name: "production_raw",
        operationSpecificInfo: "col_name=facility_code, default_value=SRR",
        dataset2Name: null,
        outputParameters: null,
        order: 2
      },
      {
        stepId: "S-003",
        stepName: "Rename Volume Field",
        dataOperation: "RenameCol",
        dataset: "DS-CLEAN-001",
        dataset1Name: "production_clean",
        operationSpecificInfo: "old_name=vol, new_name=volume_bbl",
        dataset2Name: null,
        outputParameters: null,
        order: 3
      },
      {
        stepId: "S-004",
        stepName: "Join Reference Data",
        dataOperation: "Join",
        dataset: "DS-CLEAN-001",
        dataset1Name: "production_clean",
        operationSpecificInfo: "join_key=facility_code, join_type=LEFT",
        dataset2Name: "facility_reference",
        outputParameters: "joined_production",
        order: 4
      }
    ]
  },
  {
    id: 2,
    workflowId: "WF-002",
    workflowCategory: "Transformation",
    workflowName: "Normalize Equipment Tags",
    businessUnit: "Midstream",
    facility: "El Segundo Terminal",
    payload: "equipment_tags_v1",
    steps: [
      {
        stepId: "S-001",
        stepName: "Ingest Equipment Data",
        dataOperation: "Ingest",
        dataset: "DS-EQ-001",
        dataset1Name: "equipment_raw",
        operationSpecificInfo: "Source: SQL Server [dbo].[equipment_tags]",
        dataset2Name: null,
        outputParameters: null,
        order: 1
      },
      {
        stepId: "S-002",
        stepName: "Rename Tag ID",
        dataOperation: "RenameCol",
        dataset: "DS-EQ-001",
        dataset1Name: "equipment_raw",
        operationSpecificInfo: "old_name=tag, new_name=equipment_tag_id",
        dataset2Name: null,
        outputParameters: null,
        order: 2
      },
      {
        stepId: "S-003",
        stepName: "Add Region Column",
        dataOperation: "AddCol",
        dataset: "DS-EQ-002",
        dataset1Name: "equipment_renamed",
        operationSpecificInfo: "col_name=region, default_value=West",
        dataset2Name: null,
        outputParameters: "equipment_final",
        order: 3
      }
    ]
  },
  {
    id: 3,
    workflowId: "WF-003",
    workflowCategory: "Reporting",
    workflowName: "Monthly Emissions Summary",
    businessUnit: "Downstream",
    facility: "Richmond Refinery",
    payload: "emissions_monthly_v3",
    steps: [
      {
        stepId: "S-001",
        stepName: "Ingest Emissions Records",
        dataOperation: "Ingest",
        dataset: "DS-EM-001",
        dataset1Name: "emissions_raw",
        operationSpecificInfo: "Source: Azure Blob /emissions/monthly/",
        dataset2Name: null,
        outputParameters: null,
        order: 1
      },
      {
        stepId: "S-002",
        stepName: "Add Reporting Period",
        dataOperation: "AddCol",
        dataset: "DS-EM-001",
        dataset1Name: "emissions_raw",
        operationSpecificInfo: "col_name=reporting_period, formula=YYYYMM",
        dataset2Name: null,
        outputParameters: null,
        order: 2
      },
      {
        stepId: "S-003",
        stepName: "Join Facility Metadata",
        dataOperation: "Join",
        dataset: "DS-EM-002",
        dataset1Name: "emissions_staged",
        operationSpecificInfo: "join_key=facility_id, join_type=INNER",
        dataset2Name: "facility_metadata",
        outputParameters: "emissions_with_meta",
        order: 3
      },
      {
        stepId: "S-004",
        stepName: "Rename CO2 Column",
        dataOperation: "RenameCol",
        dataset: "DS-EM-003",
        dataset1Name: "emissions_with_meta",
        operationSpecificInfo: "old_name=co2_val, new_name=co2_metric_tons",
        dataset2Name: null,
        outputParameters: "emissions_final",
        order: 4
      }
    ]
  },
  {
    id: 4,
    workflowId: "WF-004",
    workflowCategory: "Ingestion",
    workflowName: "Load Well Completion Data",
    businessUnit: "Upstream",
    facility: "Kern River Operations",
    payload: "well_completion_v2",
    steps: [
      {
        stepId: "S-001",
        stepName: "Ingest Well Records",
        dataOperation: "Ingest",
        dataset: "DS-WL-001",
        dataset1Name: "well_raw",
        operationSpecificInfo: "Source: PI Historian export",
        dataset2Name: null,
        outputParameters: null,
        order: 1
      },
      {
        stepId: "S-002",
        stepName: "Rename Completion Date",
        dataOperation: "RenameCol",
        dataset: "DS-WL-001",
        dataset1Name: "well_raw",
        operationSpecificInfo: "old_name=comp_dt, new_name=completion_date",
        dataset2Name: null,
        outputParameters: null,
        order: 2
      }
    ]
  },
  {
    id: 5,
    workflowId: "WF-005",
    workflowCategory: "Transformation",
    workflowName: "Standardize Safety Incident Fields",
    businessUnit: "Global HSE",
    facility: "Corporate HQ",
    payload: "safety_incidents_v1",
    steps: [
      {
        stepId: "S-001",
        stepName: "Ingest Incident Reports",
        dataOperation: "Ingest",
        dataset: "DS-SI-001",
        dataset1Name: "incidents_raw",
        operationSpecificInfo: "Source: SharePoint List export",
        dataset2Name: null,
        outputParameters: null,
        order: 1
      },
      {
        stepId: "S-002",
        stepName: "Add Severity Category",
        dataOperation: "AddCol",
        dataset: "DS-SI-001",
        dataset1Name: "incidents_raw",
        operationSpecificInfo: "col_name=severity_tier, formula=CASE severity",
        dataset2Name: null,
        outputParameters: null,
        order: 2
      },
      {
        stepId: "S-003",
        stepName: "Rename Incident Type",
        dataOperation: "RenameCol",
        dataset: "DS-SI-002",
        dataset1Name: "incidents_staged",
        operationSpecificInfo: "old_name=inc_type, new_name=incident_category",
        dataset2Name: null,
        outputParameters: "incidents_clean",
        order: 3
      }
    ]
  }
];

module.exports = { workflows };

# Appa Build basics
Appa Build package's main purpose is to build impact models.
Building an impact model requires four types of files :

1. Foreground datasets 
2. LCA configuration, which is specific to each LCA
3. Context configuration, that usually necessitate to be defined once for all LCAs
4. Background databases

Next sections cover all these elements, in a nutshell, using the case-study provided in Appa Build source code.

## Foreground datasets
Each foreground dataset is described in one _yaml_ (or _json_) file.
Structure of these files are closely related to Brightway's representation of Activities and Exchanges.
We encourage you to take a look at Brightway's documentation ('legacy' version) beforehand.

Next example contain common fields that can be found in those yaml.
You can click the :material-plus-circle: to have information about each field.

``` { .yaml linenums="1" title="logic_wafer_manufacturing.yaml" }
name: logic_wafer_manufacturing # (1)!
location: GLO # (2)!
type: process # (3)!
unit: unit # (4)! 
amount: 1 # (5)!
parameters: # (6)!
- fab_location
- masks
comment: "[...]" # (7)!
include_in_tree: True  # (8)!
exchanges: # (9)!
- database: user_database # (10)! 
  name: cmos_wafer_production # (11)!
  type: technosphere # (12)!
  switch: # (13)!
    name: fab_location # (14)!
    options: # (15)!
    - name: TW # (16)!
      amount: "(0.049*masks + 0.3623) * 3.14159 * pow(15, 2)" # (17)!
  input:
    database: impact_proxies # (18)!
    uuid: "('EF v3.0', 'climate change', 'global warming potential (GWP100)')_technosphere_proxy" # (19)!
```

1. Name of the activity. Not really used except to indicate which activity is the FU in LCA conf file. 
2. Location of the activity. Strictly informative.
3. Type of the activity. Brightway supports "production", "process" and "" type of activity. It is not clear to us the implication of this choice, so we recommend using "process" by default.
4. Unit of the activity's output. Strictly informative. 
5. Amount of the activity produced with the given amounts of exchanges. Brightway recommends to always put it to one.
6. Free parameters in the exchange's amounts, **recursively**, i.e. the free parameters of an activity should include the free parameters of any downstream activities. Strictly informative, but we highly encourage to indicate them for debugging purposes. Dynamic checking will likely be implemented in further release. 
7. Free comment. In this activity, we indicated the source of this dataset.
8. Whether the activity should be present the produced impact model or not. Putting this flag to True will allow Appa Run to determine the FU impacts 
9. All the activities necessary to produce the desired amount of current's activity output. Exchanges can lead to background datasets, foreground datasets, or impact proxies (which is the case here). 
10. Database where the exchange will be stored. We recommend using the foreground database.  
11. Name of the exchange. It is not clear to us what Brightway does with this information. For safety, we recommend picking unique names for each exchange.
12. Exchange type. A technosphere exchange can only be connected to a technosphere database activity. A biosphere exchange can only be connected to a biosphere3 elementary flow.
13. The switch is the mechanism allowing Appa Build to handle enumeration type parameters. Each option of the switch will generate a distinct exchange. In this example, type, name, and input of the exchange will be common to each switch option, whereas the amount will be different for each switch option.  
14. Name of the enumeration type parameter. Should correspond to an enum parameter in the LCA configuration file. 
15. List of all the options covered 
16. One option per enumeration value possible. You can put any field that can be found in an exchange in a switch option, meaning you can also point switch options to different inputs, or to the same input but with different parameterization for example.
17. Amount of input required to produce the required amount of this activity. Amount can be either numeric values or string containing a formula. This formula can contain numpy functions. Here, amount is within a switch option, but if you don't require a switch, you can put in directly as an exchange field.  
18. Name of the database containing the desired activity.
19. UUID of the activity. For foreground activities imported through yaml/json importer, it corresponds to the file name (without file extension). For EcoInvent dataset, the UUIDs have been generated randomly. We encourage either finding the UUID of the desired activity using Activity Browser, or to instead dynamically look for the desired activity by name and location. This feature is covered in the "in depth" section.


Please note that the dataset file name (without the file extension) is the UUID of the dataset.
If you need a foreground dataset as input of another dataset, you will need to retrieve it using this UUID and not the dataset's name.

## Appa LCA configuration

Appa LCA configuration file contains information that should be reused for most of your projects.
Information in this file are used to setup the Brightway environment and to specify the paths to background and foreground databases.

Next example breaks down sample's Appa LCA configuration file.
You can click the :material-plus-circle: to have information about each field.

This file corresponds to the file required as first argument by the _appabuild lca build_ CLI command. 

``` { .yaml linenums="1" title="appabuild_conf.yaml" }
project_name: 'sample_project' # (1)!
databases: # (2)!
  ecoinvent: # (3)!
    name: ecoinvent_3.9.1_cutoff # (4)!
    path: 'C:\\databases\\ecoinvent_3.9.1_cutoff\\datasets' # (5)!
  foreground: # (6)!
    name: user_database # (7)!
    path: 'samples/datasets/user_database/' # (8)!
```

1. This name is used by Brightway to initialize the environment. Location of the environment is specified by the `BRIGHTWAY_DIR` environment variable.
2. Databases to import. For the moment, this is quite static as you will require one EcoInvent database and one foreground database.
3. Background databases are databases than cannot contain any parameters. Appa LCA must have access to an EcoInvent background database. We plan to make this optional.
4. Name given to the EcoInvent database. This name will be used in foreground datasets' exchanges.
5. Must correspond to a folder containing a list of `.spold` files
6. Foreground database consists in a folder containing yaml/json datasets. Sub-folder can be used.
7. Name given to the foreground database. This name will be used in foreground datasets' exchanges.
8. Folder containing yaml/json datasets. Please note that when Appa Build is run to build an impact model, only the datasets necessary for the FU will be imported.

## LCA configuration

LCA configuration contains information about the LCA and its corresponding impact model.
You will require one LCA configuration per LCA performed.

Next example breaks down sample's Appa LCA configuration file.
You can click the :material-plus-circle: to have information about each field.

This file corresponds to the file required as second argument by the `appabuild lca build` CLI command.

``` { .yaml linenums="1" title="nvidia_ai_gpu_chip_lca_conf.yaml" }
scope:
  fu: # (1)!
    name: "nvidia_ai_gpu_chip" # (2)!
    database: "user_database"
  methods: # (3)!
    - "EFV3_CLIMATE_CHANGE"
outputs:
  model:
    path: "." # (4)!
    name: "nvidia_ai_gpu_chip" # (5)!
    compile: True # (6)!
    metadata: # (7)!
      author:
        name: Maxime PERALTA
        organization: CEA
        mail: maxime.peralta@cea.fr
      reviewer:
        name: Mathias TORCASO
        organization: CEA
        mail: 
      report:
        link: https://appalca.github.io/
        description: "A mock example of Appa LCA's impact model corresponding to a fictive AI chip accelerator based on NVIDIA GPU."
        date: 03/11/2023
        version: "1"
        license: proprietary
        appabuild_version: "0.2" # (8)!
    parameters: # (9)!
      - name: cuda_core # (10)!
        type: float # (11)!
        default: 512 # (12)!
        pm_perc: 0.1 # (13)!
      - name: architecture
        type: enum # (14)!
        default: Maxwell
        weights: # (15)!
          Maxwell: 1
          Pascal: 1
      - name: usage_location
        type: enum
        default: EU
        weights:
          FR: 1
          EU: 1
      - name: energy_per_inference
        type: float
        default: 0.05
        min: 0.01 # (16)!
        max: 0.1 # (17)!
      - name: lifespan
        type: float
        default: 2
        pm: 1 # (18)!
      - name: inference_per_day
        type: float
        default: 3600
        pm_perc: 0 # (19)!
```

1. Functional Unit (FU) corresponds to the activity producing the reference flow. FU should be stored in foreground database.
2. Please note that FU should be indicated by name, and not by UUID. Make sure FU name is unique.
3. LCIA methods to cover. Appa LCA uses a mapping between short keys and full LCIA method names as present in Brightway. So far, we only mapped PEF3.0 LCIA methods (please refer to the FAQ sections for more information).
4. Output folder to store impact model
5. Name of the yaml file corresponding to the impact model (don't include file extension)
6. If True, all symbolic expressions to necessary by Appa Run to generate any kind of results will be precomputed by Appa Build and stored in impact model. This will lead to bigger impact model files and a bit more building time. If False, those symbolic expressions will be computed by Appa Run when required, which will lead to more time during runtime (but only for the first computation).
7. Following fields are informative and will be included in the impact model, and are meant for the impact model user to better understand the LCA leading to the impact model, as well as to ease reproducibility.
8. Appa Build version used to produce the impact model. Be careful this has, for the moment, to be indicated manually. You can find Appa Build version in setup.py. 
9. Information about all the free parameters required by the FU.
10. Name of the parameter. For float parameter, this name will be present in some exchange's amount expression. For enum parameter, this will correspond to the name of a switch.
11. Type of the parameter, which can either be float or enum. Float parameter are used to parameterize the amount of exchange(s).
12. Default value used by Appa Run if the user does not indicate a new one.
13. Used to determine the lower and upper bounds of the parameter, for features using Monte Carlo simulation. Pm_perc (plus/minus, as a percentage) dynamically fixes min and max value as respectively default*(1-pm_perc) and default*(1+pm_perc).
14. Type of the parameter, which can either be float or enum. Enum parameter can be used to include modularity in LCA, i.e. to modify exchange's amount, exchange's input activity, or exchange's input activity parameterization depending on the value of a variable.
15. Contains two information: the possible values of the enum parameter (should correspond to the switch's options' name), and their corresponding probability, for features such as Monte Carlo simulation. 
16. Min bound of the parameter, used for features such as Monte Carlo simulation.
17. Max bound of the parameter, used for features such as Monte Carlo simulation.
18. Used to determine the lower and upper bounds of the parameter, for features using Monte Carlo simulation. Pm (plus/minus) dynamically fixes min and max value as respectively default-pm and default+pm.
19. If the value of a parameter is certain and shouldn't move during Monte Carlo simulation, you can indicate pm, or pm_perc at zero.

## Background databases

Background databases are databases than cannot be parameterized.
For the moment, only EcoInvent 3.9.1 is supported, and is required.
Please refer to the [FAQ](..%2Fabout%2Ffaq.md) section for further comments on the matter.

## Let's build an impact model!

Once you created your datasets, your configuration files, and made sure you have downloaded EcoInvent to the right location, you can build your model using the command:

```
appabuild lca build PATH_TO_APPALCA_CONF PATH_TO_LCA_CONF
```

Depending on how you installed the `appabuild` package, you may need to activate your virtual environment beforehand.

`lca build` corresponds to the command indicating to Appa Build that you want to build an impact model.
Other commands are covered in the [Appa Build in depth](..%2Fin_depth%2Fappa_build_in_depth.md) section.

`PATH_TO_APPALCA_CONF` corresponds to the path leading to your Appa LCA conf file. To build sample example, you can use `samples/conf/appalca_conf.yaml`.

`PATH_TO_LCA_CONF` corresponds to the path leading to your LCA conf file. To build sample example, you can use `samples/conf/nvidia_ai_gpu_chip_lca_conf.yaml`.

First usage of `appabuild` will be long, as Brightway has to initialize a Brightway project. Next usages should be faster.

This command should produce an impact model at the location specified in the LCA configuration file.
Exhaustive breakdown of the fields of this impact model can be found in the [Impact models in depth](..%2Fin_depth%2Fimpact_models_in_depth.md) section.

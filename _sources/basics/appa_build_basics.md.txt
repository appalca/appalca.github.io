# Appa Build basics
The main purpose of Appa Build package is to build impact models.
Building an impact model requires four types of files:

1. Foreground datasets 
2. LCA configuration, which is specific to each LCA
3. Context configuration, which usually needs to be defined once for all LCAs
4. Background databases

The next sections cover all these elements, in a nutshell, using the case study provided in the Appa Build source code.
## Foreground datasets
Each foreground dataset is described in a _yaml_ (or _json_) file.
The structure of these files is closely related to Brightway's representation of Activities and Exchanges.
We recommend you to have a look at Brightway's documentation ('legacy' version) first.

The next example contains common fields that can be found in a dataset file.
You can click the :material-plus-circle: to have information about each field.

```{code-block} yaml
:caption: logic_wafer_manufacturing.yaml
:lineno-start: 1

name: logic_wafer_manufacturing #(1)!
location: GLO #(2)!
type: process #(3)!
unit: unit #(4)! 
amount: 1 #(5)!
parameters: #(6)!
- fab_location
- masks
comment: "[...]" #(7)!
include_in_tree: True  #(8)!
exchanges: #(9)!
- database: user_database #(10)! 
  name: cmos_wafer_production #(11)!
  type: technosphere #(12)!
  switch: #(13)!
    name: fab_location #(14)!
    options: #(15)!
    - name: TW #(16)!
      amount: "(0.049*masks + 0.3623) * 3.14159 * pow(15, 2)" #(17)!
  input:
    database: impact_proxies #(18)!
    uuid: "('EF v3.0', 'climate change', 'global warming potential (GWP100)')_technosphere_proxy" #(19)!
```

1. Activity name. Not really used except to indicate which activity is the FU in the LCA conf file. 
2. Location of the activity. Purely informative.
3. Type of activity. Brightway supports "production", "process" and "" type of activity. It is not clear to us what this choice means, so we recommend using "process" by default.
4. Unit of the activity's output. Strictly informative. 
5. Amount of the activity produced with the given amount of exchanges. Brightway recommends to always set it to one.
6. Free parameters in the exchange amount, **recursively**, i.e. the free parameters of an activity should include the free parameters of all downstream activities. Strictly informative, but we strongly encourage you to include them for debugging purposes. Dynamic checking will probably be implemented in a future release. 
7. Free comment. In this activity, we have indicated the source of this record.
8. Whether or not the activity should be present in the generated impact model. Setting this flag to True will allow Appa Run to determine the FU impacts.
9. All activities necessary to produce the desired amount of current activity output. Exchanges can lead to background datasets, foreground datasets, or impact proxies (which is the case here). 
10. Database where the exchange will be stored. We recommend using the foreground database.
11. Name of the exchange. It is not clear to us what Brightway does with this information. For safety, we recommend choosing unique names for each exchange.
12. Exchange type. A technosphere exchange can only associated with a technosphere database activity. A biosphere exchange can only be associated with a biosphere3 elementary flow.
13. The switch is the mechanism that allows Appa Build to handle enumeration type parameters. Each option of the switch creates a different exchange. In this example the type, name and input of the exchange will be common to each switch option, while the amount will be different for each switch option.  
14. The name of the enumeration type parameter. Should match an enum parameter in the LCA configuration file. 
15. List of all covered options.
16. One option per enumeration value. You can put any field that can be found in an exchange in a switch option. For example, you can point switch options to different inputs, or to the same input but with different parameterization.
17. Amount of input required to produce the required amount of this activity. Amount can be either numeric values or a string containing a formula. This formula may contain numpy functions. Here, amount is inside a switch option, but if you don't need a switch, you can enter it directly as an exchange field.  
18. The name of the database containing the desired activity.
19. UUID of the activity. For foreground activities imported by yaml/json importer, this is the file name (without extension). For EcoInvent dataset, the UUIDs have been randomly generated. We suggest you to either find the UUID of the desired activity using the Activity Browser, or instead to dynamically search for the desired activity by name and location. This feature is covered in the "in depth" section.
## Appa LCA configuration
The Appa LCA configuration file contains information that should be reused for most of your projects.
The information in this file is used to set up Brightway's environment and to specify the paths to the background and foreground databases.

The next example breaks down sample's Appa LCA configuration file.
You can click on the :material-plus-circle: to get information about each field.

This file corresponds to the file required as the first argument by the _appabuild lca build_ CLI command. 

```{code-block} yaml
:caption: appabuild_conf.yaml
:lineno-start: 1

project_name: 'sample_project' #(1)!
databases: #(2)!
  ecoinvent: #(3)!
    name: ecoinvent_3.9.1_cutoff #(4)!
    path: 'C:\\databases\\ecoinvent_3.9.1_cutoff\\datasets' #(5)!
  foreground: #(6)!
    name: user_database #(7)!
    path: 'samples/datasets/user_database/' #(8)!
```

1. This name is used by Brightway to initialize the environment. The location of the environment is specified by the `BRIGHTWAY_DIR` environment variable.
2. Databases to import. At the moment this is quite static as you need one EcoInvent database and one foreground database.
3. Background databases are databases that cannot contain parameters.
4. Name given to the EcoInvent database. This name will be used in foreground datasets' exchanges.
5. Must correspond to a folder containing a list of `.spold` files.
6. Foreground database consists of a folder containing yaml/json datasets. Subfolders can be used.
7. Name given to the foreground database. This name will be used in foreground datasets' exchanges.
8. Folder containing yaml/json datasets. Note that when Appa Build is run to build an impact model, only the datasets needed for the FU will be imported.

## LCA configuration

The LCA configuration contains information about the LCA and its corresponding impact model.
You need one LCA configuration per LCA performed.

The next example breaks down the Appa LCA sample configuration file.
You can click on the :material-plus-circle: to get information about each field.

This file corresponds to the file required as the second argument by the `appabuild lca build` CLI command.

```{code-block} yaml
:caption: nvidia_ai_gpu_chip_lca_conf.yaml
:lineno-start: 1

scope:
  fu: #(1)!
    name: "nvidia_ai_gpu_chip" #(2)!
    database: "user_database"
  methods: #(3)!
    - "EFV3_CLIMATE_CHANGE"
outputs:
  model:
    path: "." #(4)!
    name: "nvidia_ai_gpu_chip" #(5)!
    compile: True #(6)!
    metadata: #(7)!
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
        appabuild_version: "0.2" #(8)!
    parameters: #(9)!
      - name: cuda_core #(10)!
        type: float #(11)!
        default: 512 #(12)!
        pm_perc: 0.1 #(13)!
      - name: architecture
        type: enum #(14)!
        default: Maxwell
        weights: #(15)!
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
        min: 0.01 #(16)!
        max: 0.1 #(17)!
      - name: lifespan
        type: float
        default: 2
        pm: 1 #(18)!
      - name: inference_per_day
        type: float
        default: 3600
        pm_perc: 0 #(19)!
```

1. Functional Unit (FU) corresponds to the activity that produces the reference flow. The FU should be stored in the foreground database.
2. Note that FU should be specified by name, not by UUID. Make sure that the FU name is unique.
3. LCIA methods to cover. Appa LCA uses a mapping between short keys and full LCIA method names as available in Brightway. So far we only mapped PEF3.0 LCIA methods (see the FAQ sections for more information).
4. Output folder for saving impact model
5. Name of the yaml file corresponding to the impact model (do not include file extension)
6. If True, all symbolic expressions needed by Appa Run to generate any kind of results will be precomputed by Appa Build and stored in the impact model. This will result in larger impact model files and a longer building time. If False, those symbolic expressions will be computed by Appa Run when required, which will lead to more time during runtime (but only for the first computation).
7. The following fields are informative and will be included in the impact model, and are meant to help the user of the impact model to better understand the LCA leading to the impact model, as well as to facilitate reproducibility.
8. Appa Build version used to create the impact model. Note that this has to be entered manually at the moment. The Appa Build version can be found in setup.py. 
9. Information about all free parameters needed by the FU.
10. Name of the parameter. For float parameter, this name will be present in the amount expression of some exchanges. For enum parameter, this will correspond to the name of a switch.
11. Type of the parameter, which can either be float or enum. Float parameters are used to parameterize the amount of exchange(s).
12. Default value used by Appa Run if the user does not specify a new one.
13. Used to determine the lower and upper bounds of the parameter, for features using Monte Carlo simulation. Pm_perc (plus/minus, in percent) dynamically sets the minimum and maximum values to default*(1-pm_perc) and default*(1+pm_perc), respectively.
14. Type of the parameter, which can be either float or enum. Enum parameter can be used to include modularity in LCA, i.e. to modify the exchange's amount, exchange's input activity, or exchange's input activity's parameterization depending on the value of a variable.
15. Contains two information: the possible values of the enum parameter (should correspond to the name of the switch's options), and their corresponding probability, for features such as Monte Carlo simulation. 
16. The minimum limit of the parameter, used for features such as Monte Carlo simulation.
17. The maximum limit of the parameter, used for features such as Monte Carlo simulation.
18. Used to set the lower and upper bounds of the parameter, for features using Monte Carlo simulation. Pm (plus/minus) dynamically sets the minimum and maximum values as default-pm and default+pm, respectively.
19. If the value of a parameter is fixed and you don't want it to vary during the Monte Carlo simulation, you can set pm, or pm_perc at zero.

## Background databases

Background databases are databases than cannot be parameterized.
Currently, only EcoInvent 3.9.1 is supported.
Please refer to the [FAQ](../about/faq.md) section for more information.

## Let's build an impact model!

Once you have created your datasets, your configuration files, and made sure you have downloaded EcoInvent to the correct location, you are ready to build your model using the command:

```
appabuild lca build PATH_TO_APPALCA_CONF PATH_TO_LCA_CONF
```

Depending on how you installed the `appabuild` package, you may need to activate your virtual environment first.

`lca build` is the command that tells Appa Build that you want to build an impact model.
Other commands are covered in the section [Appa Build in depth](../in_depth/appa_build_in_depth.md).

`PATH_TO_APPALCA_CONF` is the path to your Appa LCA conf file. You can use `samples/conf/appalca_conf.yaml` to build the sample.

`PATH_TO_LCA_CONF` is the path to your LCA conf file. You can use `samples/conf/nvidia_ai_gpu_chip_lca_conf.yaml`to build the sample.

The first use of `appabuild` will be long because Brightway has to initialize a Brightway project. Next usage should be faster.

This command should create an impact model at the location specified in the LCA configuration file.
A complete breakdown of the fields of this impact model can be found in the section [Impact models in depth](../in_depth/impact_models_in_depth.md).

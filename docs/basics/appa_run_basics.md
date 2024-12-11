# Appa Run basics

This section will describe some basic usages of Appa Run to run an impact model.
Code and files presented in this section can be found in the `samples/` directory of apparun source code.
Other usages are presented in section [Appa Run in depth](..%2Fin_depth%2Fappa_run_in_depth.md).

## Get FU scores

Most basic operation with impact models can be to compute FU impact scores with a set of parameters.

### Using CLI

To use the CLI, parameters values have to be indicated in a yaml file.
Next example is a parameter file for the nvidia_ai_gpu_chip sample impact model.
You can click the :material-plus-circle: to have information about each field.

``` { .yaml linenums="1" title="samples/conf/parameters.yaml" }
lifespan: 3 # (1)!
architecture: Maxwell # (2)!
cuda_core: [256, 512, 1024] # (3)!
energy_per_inference: [0.05, 0.06, 0.065] # (4)!
```

1. Float type parameter
2. Enum type parameter. The value must match with one of the possible option.
3. Parameters (float and enum) can also be given as a list, which will give one set of scores for each set of parameter. If list parameters cohabit with single value parameters like in this example, the single value will be duplicated to the size of the list parameters. 
4. If you use two list parameters, their size should match.

Following command will compute the scores. You need to indicate to apparun where the impact models are stored by setting the `APPARUN_IMPACT_MODELS_DIR` environment variable (here, to `samples/`).

```apparun compute nvidia_ai_gpu_chip samples/conf/parameters.yaml --output-file-path outputs/scores.yaml```

`compute` argument corresponds to the name of the command. `nvidia_ai_gpu_chip`.
Following argument is the name of the impact model (without file extension).
Third argument is the file containing the parameters values.
Finally, `--output-file-path outputs/scores.yaml` is an optional argument to store the results in a file.

Here is what should print (and optionally save) the command:

```{'scores': {'EFV3_CLIMATE_CHANGE': [6.814605183702477, 23.409114107243994, 124.77822686500075]}}```

### Using Python API

The equivalent using the Python API is as follows, and should print the same result:

``` { .python linenums="1" title="samples/conf/parameters.yaml" }
scores = impact_model.get_scores(lifespan=3,
                                 architecture="Maxwell",
                                 cuda_core=[256, 512, 1024],
                                 energy_per_inference=[0.05, 0.06, 0.065])
print(scores)
```

## Get nodes scores

If you put the flag `include_in_tree` to `True` in some activities used by the FU when constructing the impact model using Appa Build, you should have an impact model with different nodes, organized as a tree.
You can compute the scores on all the nodes of your impact model in a similar way. This can be useful to break down the impacts on life cycle phases, or on sub-components of the system.

In our sample model, we have intermediate nodes on a `ai_use_phase` and a `nvidia_gpu_die_manufacturing` node.

### Using CLI

Usage is really similar to the `apparun compute` command except we use `apparun compute-nodes`: 

```apparun compute-nodes nvidia_ai_gpu_chip samples/conf/parameters.yaml --output-file-path outputs/scores.yaml```

Result: 
``` ```


### Using Python API

The equivalent using the Python API is as follows, and should print the same result:

``` { .python linenums="1" title="samples/conf/parameters.yaml" }
nodes_scores = impact_model.get_nodes_scores(lifespan=3,
                                             architecture="Maxwell",
                                             cuda_core=[256, 512, 1024],
                                             energy_per_inference=[0.05, 0.06, 0.065])
print(nodes_scores)
```

## Generate uncertainty figure and tables

Appa Run comes with a number of ready-to-use results, such as tree map or sankey graphs, or sobol indices computation.
Those results typically can output a table containing all the values necessary to generate a figure, as well as a ready-to-use result.

In this example we will illustrate how to use already implemented result to generate a Tree Map.

### Using CLI

First we need a configuration file to indicate apparun some information about the results to generate.
You can click the :material-plus-circle: to have information about each field.

``` { .yaml linenums="1" title="samples/conf/all_results.yaml" }
- result_name: tree_map # (1)!
  args:
    impact_model:
      name: nvidia_ai_gpu_chip # (2)!
      parameters: # (3)!
        architecture: "Maxwell"
        cuda_core: 512
    output_name: nvidia_ai_gpu_chip-Maxwell_512-tree_map # (4)!
    html_save_path: "outputs/figures/" # (5)!
    pdf_save_path: "outputs/figures/" # (6)!
    table_save_path: "outputs/tables/" # (7)!
    png_save_path: "outputs/figures/" # (8)!
    width: 1000 # (9)!
    height: 700 # (10)!
```

1. Name of the result class. All options are covered in the [Appa Run in depth](..%2Fin_depth%2Fappa_run_in_depth.md) section.
2. Name of the impact model to load and execute.
3. You can optionally give new parameters values if the default ones contained in the impact model don't suit you.
4. Root name used for the output files (files and figures).
5. Path to save figures as a html file. No html file will be generated if this argument is not set.
6. Path to save figures as a pdf file. No html file will be generated if this argument is not set.
7. Path to save table. No table file will be generated if this argument is not set.
8. Path to save figures as a png file. No html file will be generated if this argument is not set.
9. Width of the generated figures.
10. Height of the generated figures.

Here is a figure we can obtain:

![Sample Tree Map Figure](../assets/basics/tree_map-EFV3_CLIMATE_CHANGE.svg){ width="600" }
/// caption
Tree Map result for the sample case. Area of each box corresponds to their relative contribution to climate change. 
///


### Using Python API

Same figure can be generated using Python API:

``` { .python linenums="1" title="samples/conf/parameters.yaml" }
tree_map_result = get_result("tree_map")(
    impact_model=impact_model,
    output_name="tree_map",
    pdf_save_path=os.path.join(OUTPUT_FILES_PATH, "figures/"),
    table_save_path=os.path.join(OUTPUT_FILES_PATH, "tables/"),
    html_save_path=os.path.join(OUTPUT_FILES_PATH, "figures/"),
)
tree_map_table = tree_map_result.get_table()
tree_map_result.get_figure(tree_map_table)
```

If the default values of your impact model doesn't correspond to the tree map you want to generate, you can update them by calling the following method beforehand:

```impact_model.parameters.update_defaults({"cuda_core": 256, "architecture": "Maxwell"})```

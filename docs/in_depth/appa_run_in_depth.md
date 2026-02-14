# Appa run in depth

## Expressions as values for impact models parameters

When computing the FU scores or the nodes scores of an impact model, it is possible to use
expressions instead of constants for the parameters.

There are two types of expressions : enum type expressions and float type expressions.


Float type expressions are arithmetic expressions where the variables are existing parameters
of the impact model. Each parameter used in a float type expression must be a float type parameter.


Enum type expressions are similar to the match structure in python. Each enum type expression
use one and only one enum type parameter from the impact model and each option of the parameter
must have a sub-expression associated. The sub-expressions can be enum or float type expressions
and also constants.

### Using CLI

Here's an example about how to use expressions in a yaml file:
:::{code-block} yaml
:caption: samples/conf/parameters.yaml
:lineno-start: 1

lifespan: log(inference_per_day) * 0.1 - cuda_core * pow(energy_per_inference, 3) #(1)!
architecture: [Maxwell, Pascal, Maxwell]
cuda_core:
    architecture: #(2)!
        Maxwell: 512
        Pascal: 560
energy_per_inference:
    - architecture: #(3)!
        Maxwell: 0.024
        Pascal: 0.0198
    - log(inference_per_day) * 0.006
    - 0.0235
:::

1. Float type expression
2. Enum type expression
3. Expressions can be used in list just as constants

### Using the Python API

The equivalent using the Python API is as follows, and should produce the same result:

:::{code-block} python
:caption: samples/conf/parameters.yaml
:lineno-start: 1

scores = impact_model.get_scores(lifespan="log(inference_per_day) * 0.1 - cuda_core * pow(energy_per_inference, 3)",
                                 architecture=["Maxwell", "Pascal", "Maxwell"],
                                 cuda_core={
                                    "architecture": {
                                        "Maxwell": 512,
                                        "Pascal": 560
                                    }
                                 },
                                 energy_per_inference=[
                                    {
                                        "architecture": {
                                            "Maxwell": 0.024,
                                            "Pascal": 0.0198
                                        }
                                    },
                                    "log(inference_per_day) * 0.006",
                                    0.235
                                 ])
print(scores)
:::
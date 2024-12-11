# Appa LCA framework

Appa LCA (**A**utomatable, **P**ortable and **Pa**rametric **L**ife **C**ycle **A**ssessment) framework was developed to ease the usage of screening LCA in any workflow or software, in the perspective of easing ecodesign initiatives.
It intends to bring the best of the LCA method, which is versatile, holistic and flexible, and of _ad hoc_ impact assessment tools, which are easy to use and integrate.
It relies on the production and usage of impact models, which can be seen as standalone, parametric and modular LCA templates that operate at the impact level, i.e. after application of the LCIA methods.  

Appa LCA's main particularity is to split the complexity of LCA in two distinct, asynchronous worlds, with their own dedicated tool:

- The LCA practitioner world, addressed in the Appa Build package.
- The system designer world, addressed in the Appa Run package.

Appa Build produces impact models, and offer different features that may be useful for an LCA practitioner. As an example, Appa Build allows to import impact data from other LCA software in the perspective of using background datasets from any LCA database.
Appa Run imports Impact Models and provide interfaces to execute them easily from any workflow or software environment, as it is light, fast, requires just a few python packages dependencies with no major constraints in terms of package versions, and no LCA database dependencies.

![Appa LCA framework](assets/appalca_framework.svg){ width="600" }
/// caption
Appa LCA framework consists in two Python packages, Appa Build and Appa Run, which respectively produces impact models and run them. 
///

## What problems does it solve?
Commercial LCA tools are typically not easy to interface with design workflows. They are quite heavy piece of codes, requiring licenses for the software itself and for the LCI databases. They do not always provide API to interface them with another software.
On the other hand, some tools can solve this problem but are typically computing carbon impact only, and are not thought to be dynamically connected with a LCA.
Appa Run intend to solve all of those problems.

On the LCA side, part of the complexity lays on the difficulties to conduct inventory, as LCI data are scarse and sometimes present in databases that cannot be accessed with the same LCA software. Another source of complexity is that some data may not be representative enough.
Appa Build intend to solve those problems by enabling data import at the impact level, and by offering a powerful way to parameterize and model input LCI data (to interpolate, or extrapolate impacts of some dataset).

## When can Appa LCA be useful?
You may enjoy using Appa LCA if:

- You want to bring LCA in the workflow of a product designer
- You want to present LCA results using an interactive web app
- You want to automate screening LCA of a catalog of products
- You want an alternative way to use Brigthway and LCA algebraic

## How does it work?
Appa Build relies on the excellent Brightway, a LCA Python library, and lca_algebraic, enabling symbolic LCA computation for Brightway.
Appa Build relies on bw2data package to handle import of LCI database, LCIA methods and elementary flows.
Appa Build uses LCA algebraic to partially compute LCA: every static activity (i.e. activity without parametric exchange) is computed to the impact level.

Appa Run executes impact models without needing any of those packages, nor LCI databases. Scipy and NumPy are used to execute parametric impact formulas.

## How does an impact model looks like?
Impact models are yaml files that are automatically produced by Appa Build, and that can be imported and ran by Appa Run.
In a nushell, they contain:

- Metadata about the LCA behind the impact model
- Information about the parameters required to compute the impacts
- A series of symbolic expressions for each LCIA method, the symbols being the impact model parameters

Their content and structure are extensively covered in the [impact models in depth](in_depth%2Fimpact_models_in_depth.md) section.

Here is a simplified view of how an impact model may look like:

``` { .yaml .no-copy }
metadata:
  author:
    name: Maxime PERALTA
    organization: CEA
    mail: maxime.peralta@cea.fr
  report:
    link: https://github.com/appalca/appalca.github.io
    description: A Nvidia-GPU based AI accelerator chip. Manufacturing and use phase only.
    date: 03/11/2023
    version: '1'
    license: proprietary
    appalca_version: '0.1'
parameters:
- name: architecture
  default: Maxwell
  type: enum
  [...]
- name: cuda_core
  default: 512.0
  type: float
  [...]
- [...]
tree:
  name: nvidia_ai_gpu_chip
  models:
    EFV3_CLIMATE_CHANGE: 12500.0*architecture_Maxwell*(4.6212599075297227e-9*cuda_core
      + 7.37132179656539e-6) + 289.6776199311062*architecture_Maxwell*(0.009702834627645097*cuda_core
      + 1)**2/((1 - 0.6773699850611761*exp(-0.003779619385733156*cuda_core))**2*(70685.775/(0.1889809692866578*cuda_core
      + 19.47688243064738) - 106.7778184271516*sqrt(2)/sqrt(0.009702834627645097*cuda_core
      + 1))) + 12500.0*architecture_Pascal*(4.6891975579761074e-9*cuda_core + 7.808281424221127e-6)
      + 2626.882558417281*architecture_Pascal*(0.0060737847877931227*cuda_core + 1)**2/((1
      - 0.33777635255702983*exp(-0.0065923115776528474*cuda_core))**2*(70685.775/(0.13184623155305694*cuda_core
      + 21.707425626610416) - 101.14318001667067*sqrt(2)/sqrt(0.0060737847877931227*cuda_core
      + 1))) [...]
    EFV3_WATER_USE: [...]
  children:
  - name: ai_use_phase
    models:
      [...]
    amount: '1.0'
    children:
    - [...]
  - name: nvidia_gpu_chip_manufacturing
    models:
      [...]
    amount: '1.0'
    children:
    - [...]
```

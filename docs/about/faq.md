# Frequently Asked Questions

## Known limitations

We are aware of some limitations and plan to address them.
If on of those limit is a limiting problem for you, feel free to reach us to let us know so we can either prioritize solving the limitation, or help you doing so.

### Versions
Appa Build is currently working with Brightway 2.4.3 and lca_algebraic 1.0.0.
This involves working with Python above version 3.10.
This limits EcoInvent version support up to version 3.9.1

It is not trivial to solve those version requirements limits, as there appear to be some issues of non retro-compatibility.

### Background databases
For the moment, only EcoInvent background database is supported as we couldn't have access and test other databases supported by Brightway.

### Methods
Appa Run uses Enum to link Brightway method names to comprehensive strings.
We currently only implemented an Enum for PEF v3.0 LCIA methods and plan to also support other methods.

You can fairly easily extend the mapping to other LCIA methods. If you do so, it can be a good idea of contribution and could be integrated in Appa LCA's source code.

## Known problems
We are aware of some problems and bugs. We list them here to let you know, until we managed to solve them.

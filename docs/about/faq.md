# Frequently Asked Questions

## Known limitations

We are aware of some limitations and plan to address them.
If any of these limitations are limiting problem for you, please feel free to contact us to let us know so we can either prioritize fixing the limitation or help you fix it.

### Versions
Appa Build currently works with Brightway25 and lca_algebraic_bw25.
It is tested with Python 3.11.

### Background databases
At the moment only the EcoInvent background database is supported, as we haven't been able to access and test other databases supported by Brightway.
Data from other databases can nonetheless be imported at the impact level.

### Methods
Appa Run uses *Enum* to associate Brightway method names with comprehensive strings.
We currently only implemented an Enum for PEF v3.0 and v3.1 LCIA methods, and plan to support other methods as well.

You can easily extend the mapping to other LCIA methods. If you do so, it may be a good idea of contribution and could be integrated into Appa LCA's source code.

## Known issues
We are aware of some issues and bugs. We list them here to keep you informed until we manage to solve them.

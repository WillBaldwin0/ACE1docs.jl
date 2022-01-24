# AEC1 and IPFitting

`ACE1.jl` defines functions from the space of local atomic environments `` \mathcal{X}`` to (for example) ``\mathbb{R}``. These functions respect physical symmetries such as invariance under rotation of the environment and permutation of equivalent atoms. This set of functions ``\{B_\nu \}_\nu`` may be treated as a basis of a space of such symmetric functions, allowing us to express a property of an atomic environment ``\mathcal{C} \in \mathcal{X}`` as follows:

```math
\phi(\mathcal{C}) = \sum_\nu c_\nu B_\nu(\mathcal{C})
```

Having explicitly constructed such a basis set, the coefficients ``c_\nu`` can be found by fitting the model to data ``\{ (\mathcal{C}_i, \phi_i) \}`` and solving by, for instance, least squares:

```math
\mathbf{c} = \text{arg} \min_\mathbf{c} \sum_i \left( \phi_i - \sum_\nu c_\nu B_\nu \right)^2
```

`ACE1.jl` describes the symmetric basis set; `IPFitting.jl` handles the assembly and solution of the resulting least squares system, and provides a variety of methods for doing so. 

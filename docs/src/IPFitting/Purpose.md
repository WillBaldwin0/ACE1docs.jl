# AEC1 and IPFitting

`ACE1.jl` defines functions from the space of local atomic environments `` \mathcal{X}`` to (for example) ``\mathbb{R}``. These functions respect physical symmetries such as invariance under rotation of the environment and permutation of equivalent atoms. This set of functions ``\{B_\nu \}_\nu`` may be treated as a basis of a space of such symmetric functions, allowing us to express a property of an atomic environment ``\mathcal{C} \in \mathcal{X}`` as follows:

```math
\phi(\mathcal{C}) = \sum_\nu c_\nu B_\nu(\mathcal{C})
```

Having explicitly constructed such a basis set, the coefficients ``c_\nu`` can be found by fitting the model to data ``\{ (\mathcal{C}_i, \phi_i) \}`` and solving by, for instance, least squares:

```math
\mathbf{c} = \text{arg} \min_\mathbf{c} \sum_i \left( \phi_i - \sum_\nu c_\nu B_\nu(\mathcal{C}_i) \right)^2
```

`ACE1.jl` describes the symmetric basis set; `IPFitting.jl` handles the assembly and solution of the resulting least squares system, and provides a variety of methods for doing so. 

# The Least Squares Database

The minimisation problem above can be written:
```math
\mathbf{c} = \text{arg} \min_\mathbf{c} \| \mathbf{y} - \Psi \mathbf{c} \|^2
```
where ``y_i = \phi_i`` are the observations of the true function, and ``\Psi_{i \nu} = B_\nu(\mathcal{C}_i)``. The matrix ``\Psi`` is the design matrix. IPFitting constructs the design matrix and the observation vector (from the basis and training configurations) and stores them in a ``IPFitting.lstDB``: {link to source}

```
dB = LsqDB(save_name, basis, train)
```

If `save_name` is the empty string, the least squares system, which can be very large, is not saved to disk. Otherwise, `save_name` should be a string not including any file extension, which is added by IPFitting. `train` shuold be a vector of julia {?JuLIP?} atoms objects.

# Solving the Linear System

Solution is performed by calling `lsqfit`.
```
IP, lsqinfo = lsqfit(dB, solver=solver, weights=weights, Vref=Vref)
```

arguments:
* dB : `IPFitting.lstD`. The least sqaures system to be solved. 
* solver : `Dict()`. Specifies the solution method.
* weights : a preconditioner that reweights the absolute size of heterogeneous rows in the least squares system.
* reference potential.

returns:
* IP : The interatomic potential that can be evaluated on a new configuration
* lsqinfo : A dictionary of information about the least sqaures system and the solution process.

## solvers

Once the linear system has been formed, several methods exist for solving the above linear system. Some involve modifying the above minimisation statement but still require the design matrix and observation vector. Currently there are 4{?} solvers implemented in IPFitting which are discussed in solvers{link to solvers section}.

## weights

...

## reference potential

...





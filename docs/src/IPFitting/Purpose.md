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

## Structure of the Linear System.

Observations of the energy, forces and virial stresses of an atomic configuration can be used to train a model. Each scalar observable contributes one row to the linear system: An energy observation therefore contributes a single row, and the forces on all the of the N atoms in a configuration contribute 3N rows. 

Training configurations can also be distinguised from one another by setting the `configtype` field in the JuLIP atoms object. The least squares database recognises the config type of a configuration, which can be used to use different settings for different config types when fitting.

# Solving the Linear System

Solution is performed by calling `lsqfit`.
```
IP, lsqinfo = lsqfit(dB, solver=solver, weights=weights, Vref=Vref)
```

arguments:
* dB : `IPFitting.lstD`. The least sqaures system to be solved. 
* solver : `Dict()`. Specifies the solution method.
* weights : `Dict()`. A preconditioner that reweights the absolute size of heterogeneous rows in the least squares system.
* Vref : `Dict()`. A reference potential.

returns:
* IP : The interatomic potential that can be evaluated on a new configuration
* lsqinfo : A dictionary of information about the least sqaures system and the solution process.

The arguments are described in the following sections.

## solvers

Once the linear system has been formed, several methods exist for solving the above linear system. Some involve modifying the above minimisation statement but still require the design matrix and observation vector. Currently there are 4{?} solvers implemented in IPFitting which are discussed in solvers{link to solvers section}.

## weights

The weights dictionary can be used to rescale rows of the linear equation to emphasise some observations more than others. For instance, it may be useful to weight the rows of the linear system corresponding to the energy larger than those corresponding to forces, if there are many more force observations than energy observations. 

Different weight can also be set for different config types (see above). An example for a database containing training data with config types `MD` and `Phonon`, might be:

```
weights = Dict(
        "MD" => Dict("E" => 5.0, "F" => 1.0 , "V" => 1.0 ),
        "Phonon" => Dict("E" => 10.0, "F" => 10.0 , "V" => 10.0 ))
```

## reference potential

It is also possible to suply a reference potential ``V``, which acts as a baseline for the prediction. If a reference potential is supplied, the prediction is modelled as
```
math
\phi(\mathcal{C}) = V(\mathcal{C}) + \sum_\nu c_\nu B_\nu(\mathcal{C})
```
To implement this, the least squares database subtracts the reference from the observations before forming the linear system. The energy of the isolated atoms (a `OneBody` potential) is good reference potential:

Vref = OneBody(:Ti => -1586.0195, :Al => -105.5954)



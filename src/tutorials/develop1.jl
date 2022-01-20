
# Getting Started - 
## Developing a New ACE Model with ACE1.jl
## without IPFitting

# First import ACE1.jl
using ACE1, JuLIP, IPFitting
using LinearAlgebra: norm 

# [1] create an ACE1 basis for a Si potential 
# rpi = rotation and permutation invariant
r0 = rnn(:Si)
basis = rpi_basis(; 
      species = :Si,
      N = 3,                        # correlation order = body-order - 1
      maxdeg = 10,                  # polynomial degree
      r0 = r0,                      # estimate for NN distance
      D = SparsePSHDegree(; wL=1.3, csp=1.0),
      rin = 0.65*r0, rcut = 5.0,    # domain for radial basis (cf documentation)
      pin = 0)
@show length(basis)

# Remarks: 
#  SparsePSHDegree(; wL=1.3, csp=1.0) selects a specific sparse subset of the 
#  infinite lattice of possible ACE basis functions. See the documentation 
#  for more details: 
#     ?SparsePSHDegree

# [2] create a random training set (usually should load one e.g. from xyz)


function gen_dat()
   sw = StillingerWeber() 
   at = rattle!(bulk(:Si, cubic=true) * 3, 0.3)
   return Dat(at, "diax3"; E = energy(sw, at), F = forces(sw, at) )
end

train = [ gen_dat() for _=1:50 ]

# [3] estimate the parameters 

# assemble the least squares system; using "" for the filename means that 
# it will not be saved to disk; this evaluates the basis on the training 
# but doesn't really assemble the lsq system yet. This allows one to experimate 
# with different fitting parameters
dB = LsqDB("", basis, train)

# specify weights for lsq system, and a reference potential. 
weights = Dict("default" => Dict("E" => 15.0, "F" => 1.0 , "V" => 1.0 ))

# now assemble and solve the LSQ system 
IP, lsqinfo = lsqfit(dB; weights = weights, asmerrs = true) 

# [4] Perform some tests, here we do it manually just to demonstrate usage 
#     of the potential 
# note IP is now an ACE model whose energy, force, virial etc can now be 
# evaluated using JuLIP. 

test =  [ gen_dat() for _=1:20 ]
Etest = [ dat.D["E"][1] for dat in test ]
Emodel = [ energy(IP, dat.at) for dat in test ] 
rmse_E = norm(Etest - Emodel) / sqrt(length(test))


var documenterSearchIndex = {"docs":
[{"location":"gettingstarted/developing/#Developing-a-new-ACE1.jl-model","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"","category":"section"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"Make sure to first read the installation notes. Now start by importing the required packages: ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"using ACE1, JuLIP, IPFitting\nusing LinearAlgebra: norm ","category":"page"},{"location":"gettingstarted/developing/#Step-1:-specify-the-ACE-basis","page":"Developing a new ACE1.jl model","title":"Step 1: specify the ACE basis","text":"","category":"section"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"The ACE basis can be set up using the function rpi_basis(). ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"r0 = rnn(:Si)\nbasis = rpi_basis(; \n      species = :Si,\n      N = 3,                        # correlation order = body-order - 1\n      maxdeg = 12,                  # polynomial degree\n      D = SparsePSHDegree(; wL=1.5, csp=1.0),\n      r0 = r0,                      # estimate for NN distance\n      rin = 0.65*r0, rcut = 5.0,    # domain for radial basis (cf documentation)\n      pin = 0)\n@show length(basis)","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"where the parameters have the following meaning: ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"species: chemical species, for multiple species provide a list \nN : correlation order \nmaxdeg: maximum polynomial degree \nD : specifies the notion of polynomial degree for which there is no canonical definition in the multivariate setting. Here we use SparsePSHDegree which specifies a general class of sparse basis sets; see its documentation for more details.\nr0 : an estimate on the nearest-neighbour distance for scaling\nrin, rcut : inner and outer cutoff radii \npin :  specifies the behaviour of the basis as the inner cutoff radius.","category":"page"},{"location":"gettingstarted/developing/#Step-2:-Generate-a-training-set","page":"Developing a new ACE1.jl model","title":"Step 2: Generate a training set","text":"","category":"section"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"Normally one would generate a training set using DFT data, store it e.g. as  an .xzy file, which can be loaded via IPFitting. Here, we will just general  a random training set to show how it will be used. ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"function gen_dat()\n   sw = StillingerWeber() \n   n = rand(2:4)\n   at = rattle!(bulk(:Si, cubic=true) * n, 0.3)\n   return Dat(at, \"diax$n\"; E = energy(sw, at), F = forces(sw, at) )\nend\n\ntrain = [ gen_dat() for _=1:50 ]","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"gen_dat() generates a single training configuration wrapped in an IPFitting.Dat structure. Each d::Dat contains the structure d.at, and energy value and a force vector to train against. These are stored in the dictionary d.D. Other observations can also be provided. The string \"diax$n\" is a configtype label given to each structure which is useful in seeing what the performance of the model is on different classes of structures. \ntrain is then a list of 50 such training configurations.","category":"page"},{"location":"gettingstarted/developing/#Step-3:-Estimate-Parameters","page":"Developing a new ACE1.jl model","title":"Step 3: Estimate Parameters","text":"","category":"section"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"First we evaluate the basis on all training configurations. We do this by assembling an LsqDB which contains all information about the basis, the training data and also stores the values of the basis on the training data for later reuse e.g. to experiment with different parameter estimation algorithms, or parameters. ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"dB = LsqDB(\"\", basis, train)","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"Using the empty string \"\" as the filename means that the LsqDB will not be automatically stored to disk.","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"To assemble the LSQ system we now need to specify weights. If we want to give the same energy and force weights to all configurations, we can just do the following: ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"weights = Dict(\"default\" => Dict(\"E\" => 15.0, \"F\" => 1.0 , \"V\" => 1.0 ))","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"But e.g. we could give different weights to diax2, diax3, diax4 configs. ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"Now we can fit the potential using ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"IP, lsqinfo = lsqfit(dB; weights = weights, asmerrs = true) ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"This assembles the weighted LSQ system, and retuns the potential IP as well as a dictionary lsqinfo with some general information about the potential and fitting process.  E.g., to see the training errors we can use ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"rmse_table(lsqinfo[\"errors\"])","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"Note that IP is a JuLIP.jl calculator and can be used to evaluate e.g. energy, forces, virial on new configurations. ","category":"page"},{"location":"gettingstarted/developing/#Step-4:-Run-some-tests","page":"Developing a new ACE1.jl model","title":"Step 4: Run some tests","text":"","category":"section"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"At a minimum we should have a test set to check generalisations, but more typically we would now run extensive robustness tests. For this mini-tutorial we will just implement a very basic energy generalisation test. ","category":"page"},{"location":"gettingstarted/developing/","page":"Developing a new ACE1.jl model","title":"Developing a new ACE1.jl model","text":"test =  [ gen_dat() for _=1:20 ]\nEtest = [ dat.D[\"E\"][1] for dat in test ]\nEmodel = [ energy(IP, dat.at) for dat in test ] \nrmse_E = norm(Etest - Emodel) / sqrt(length(test))","category":"page"},{"location":"gettingstarted/pkg/#Using-the-Julia-Package-Manager","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"","category":"section"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"This is a very brief introduction to the Julia package manager, intended for newcomers to Julia who are here primarily to use the ACEsuit. But it is not really ACE specific at all. ","category":"page"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"The package manager provides functionality to organize reproducable Julia projects. A project is specified by a Project.toml where the user specifies which packages are required, and version bounds on those packages. The Package manager can then resolve these dependencies which results in a Manifest.toml where the full Julia environment is precisely specified. This can be used in a workflow as follows:","category":"page"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"To start a new project that uses ACE1.jl, e.g. to develop a new interatomic potential for TiAl we first create a new folder where the project will live, e.g., ace1_TiAl_project. Change to that folder and start the Julia REPL. Type ] to switch to the package manager, then activate a new project in the current directory via activate .\nYou now have an empty project. Start adding the packages you need, e.g.,   add ACE1, JuLIP, IPFitting","category":"page"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"Type status to see your required packages listed. (Note this is only a subset of the installed packages!). Exit the REPL and type ls; you will then see a new file Project.toml which lists the project requirements, and a Manifest.toml which lists the actually packages and the version that have been installed.","category":"page"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"Specify version bounds: Open Project.toml in an editor and under the [compat] section you can now add version bounds, e.g. ACE1 = \"0.9, 0.10\". Please see the Pkg.jl docs for details on how to specify those bounds. Start a Julia REPL again, type ] to switch to the package manager and then up to up- or down-grade all installed packages to the latest version compatible with your bounds.","category":"page"},{"location":"gettingstarted/pkg/#Notes","page":"Using the Julia Package Manager","title":"Notes","text":"","category":"section"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"The Project.toml should always be committed to your project git repo. Whether Manifest.toml is also committed is a matter of taste or context. Tracking the Manifest will (normally) ensure future compatibility since it allows you to reconstruct the precise Julia environemt that was used when the Manifest was created.\nIf you are a user rather than developer it should almost never be required for you to check out a package (or, dev it in the package manager). When we (the developers) make changes to - say - ACE1.jl we almost always immediately tag another version and then you can adjust your version bounds in your project to update as well as enforce which version to use.","category":"page"},{"location":"gettingstarted/pkg/#Links","page":"Using the Julia Package Manager","title":"Links","text":"","category":"section"},{"location":"gettingstarted/pkg/","page":"Using the Julia Package Manager","title":"Using the Julia Package Manager","text":"https://pkgdocs.julialang.org/v1/\nhttps://pkgdocs.julialang.org/v1/compatibility/","category":"page"},{"location":"tutorials/#ACE.jl-Tutorials","page":"-","title":"ACE.jl Tutorials","text":"","category":"section"},{"location":"tutorials/","page":"-","title":"-","text":"create list of tutorials for more interesting problems","category":"page"},{"location":"ipfitting/#IPFitting.jl","page":"IPFitting.jl","title":"IPFitting.jl","text":"","category":"section"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"IPFitting.jl is used to fit ACE1 potentials by using the ACE1 basis to create and solver a linear system given a training database of atomistic configurations.","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Reading in a .xyz database is done as follows and requires the energy/force/virial keys to be set. ","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"al = IPFitting.Data.read_xyz(@__DIR__() * \"/TiAl_tutorial_DB.xyz\", energy_key=\"energy\", force_key=\"force\", virial_key=\"virial\")","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Using an ACE basis B a linear system can then be created","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"dB = LsqDB(\"\", B, al)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Before solving generally a reference potential is defined containing the isolated atom energies","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Vref = OneBody(:Ti => -1586.0195, :Al => -105.5954)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"as well as the energy/force/virial weights.","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"weights = Dict(         \"default\" => Dict(\"E\" => 5.0, \"F\" => 1.0 , \"V\" => 1.0 ))","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Solving the linear system can be done through the use of several solvers:","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"solver = Dict(         \"solver\" => :lsqr,         \"damp\" => 5e-3,         \"atol\" => 1e-6)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"solver = Dict(         \"solver\" => :rrqr,         \"rrqr_tol\" => 1e-5)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"solver = Dict(         \"solver\" => :brr)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"solver= Dict(          \"solver\" => :ard,          \"ard_tol\" => 1e-4,          \"threshold_lambda\" => 1e-2)","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Performing the fit, asmerrs=true calculates the training errors which are also stored in the lsqinfo","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"IP, lsqinfo = lsqfit(dB, weights=weights, Vref=Vref, asmerrs = true).","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"Exporting to .yace format for LAMMPs support. More details on how to run the .yace potential in ...","category":"page"},{"location":"ipfitting/","page":"IPFitting.jl","title":"IPFitting.jl","text":"ACE1.ExportMulti.export_ACE(\"./filename.yace\", IP)","category":"page"},{"location":"gettingstarted/installation/#Installation-Instructions","page":"Installation Instructions","title":"Installation Instructions","text":"","category":"section"},{"location":"gettingstarted/installation/#Short-Version","page":"Installation Instructions","title":"Short Version","text":"","category":"section"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"From the Julia REPL, run: ","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"using Pkg; Pkg.activate(\".\"); pkg\"registry add https://github.com/JuliaRegistries/General\"; pkg\"registry add https://github.com/JuliaMolSim/MolSim.git\"; pkg\"add JuLIP ACE1 PyCall ASE IPFitting\"","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Expect an error arising from incompatible versions. To fix it, close the REPL, open Project.toml, and add the following to the bottom","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"[compat]\nIPFitting = \"0.4\"","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Back in the REPL, update the packages:","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"using Pkg; Pkg.activate(\".\"); Pkg.update()","category":"page"},{"location":"gettingstarted/installation/#Detailed-Instructions","page":"Installation Instructions","title":"Detailed Instructions","text":"","category":"section"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"If you have any difficulties with the following setup process, please file an issue. We highly recommend familiarizing oneself with the Julia package manager and how Project management is best done in Julia. In particular all projects should manage their own Project.toml file with appropriate version bounds, and where appropriate the Manifest.toml file can be tracked in order to guarantee reproducibility of results. ","category":"page"},{"location":"gettingstarted/installation/#Installing-Julia","page":"Installation Instructions","title":"Installing Julia","text":"","category":"section"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Download and unpack Julia. We recommend v1.6 or upwards. Add the julia executable to your path with something like export PATH=<julia-directory>/bin:$PATH.","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Start the Julia REPL (type julia followed by Enter), switch to package manager by typing ], then install the General registry and the MolSim registry:","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"registry add https://github.com/JuliaRegistries/General\nregistry add https://github.com/JuliaMolSim/MolSim.git","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Press Backspace or Ctrl-c to exit the package manager. Use Ctrl-d, or exit() followed by Enter, to close the Julia REPL.","category":"page"},{"location":"gettingstarted/installation/#Setting-up-a-project-using-ACE1","page":"Installation Instructions","title":"Setting up a project using ACE1","text":"","category":"section"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Create a folder for your new project and change to it. Start the Julia REPL and activate a new project by switching to the package manager with ], and then running","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"activate .","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Now you can install the packages you need. (Ignore any installation errors during the initial install, and note the version information below.) Remaining in the package manager, start with","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"add JuLIP ACE1","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"To use ase from Julia, you can use PyCall or the ASE.jl interface. To install these, run","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"add PyCall ASE","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"For fitting, you may wish to use IPFitting.jl,","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"add IPFitting","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Note that IPFitting.jl has ASE.jl as a dependency.","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Finally, set version restrictions by closing the REPL, opening Project.toml, and adding the following to the bottom","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"[compat]\nIPFitting = \"0.4\"","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"Back in the REPL, update the packages:","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"using Pkg; Pkg.activate(\".\"); Pkg.update()","category":"page"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"See this section and the Julia package manager documentation for more information.","category":"page"},{"location":"gettingstarted/installation/#Trouble-shooting","page":"Installation Instructions","title":"Trouble-shooting","text":"","category":"section"},{"location":"gettingstarted/installation/","page":"Installation Instructions","title":"Installation Instructions","text":"On some systems ASE.jl is unable to automatically install python dependencies. We found that installing Anaconda and then pointing PyCall.jl to the Anaconda installation (cf PyCall Readme) resolves this. After installing Anaconda, it should then be sufficient to build ASE.jl again.\nIf you cannot use Anaconda python, or if the last point failed, then you can try to install the python dependencies manually before trying to build ASE.jl again. Specifically, it should be sufficient to just install the ase package. Please follow the installation instructions on their website.","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"import os from ase.calculators.lammpsrun import LAMMPS from ase.io import read, write import time","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"os.environ[\"ASELAMMPSRUNCOMMAND\"]=\"/Users/Cas/gits/lammps-ace/build/lmp\"","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"parameters = {'pairstyle': 'pace',              'paircoeff': ['* * TiAltutorialpot.yace Ti Al']}","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"files = [\"TiAltutorialpot.yace\"]","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"calc1 = LAMMPS(parameters=parameters, files=files)","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"at = read(\"./TiAltutorialDB.xyz\", \":\")[0]","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"at.set_calculator(calc1)","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"print(at.getpotentialenergy()) print(at.getforces()) print(at.getstress())","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"N=10","category":"page"},{"location":"tutorials/lammps/","page":"-","title":"-","text":"t1 = time.time() for i in range(N): \tat.rattle(0.1) \tat.setcalculator(calc1) \tat.getforces() t2 = time.time() print(\"FORCE MS/ATOM PACE\") print(((t2 - t1)/len(at) * 1E3 / N))","category":"page"},{"location":"gettingstarted/aceintro/#Introduction-to-ACE-Models","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"The purpose of this section is to give a brief summary of the mathematics behind linear ACE parameterisations of invariant atomic properties. ","category":"page"},{"location":"gettingstarted/aceintro/#Invariant-Properties","page":"Introduction to ACE Models","title":"Invariant Properties","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"To explain the main ideas in the simplest non-trivial setting, we consider systems of indistinguishable particles. A configuration is an mset R =  bm r_j _j subset mathbbR^3 with arbitary numbers of particles and we wish to develop representation of properties ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"   varphibig(R) in mathbbR","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"which are invariant under permutations (already implicit in the fact that R is an mset) and under isometries O(3). To make this explicit we can write this as","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"varphibig(  Q bm r_sigma j _j big)\n=\nvarphibig(  bm r_j _j big) qquad forall Q in O(3) \nquad sigma text a permutation","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"To that end we proceed in three steps: ","category":"page"},{"location":"gettingstarted/aceintro/#Density-Projection-/-Atomic-Base","page":"Introduction to ACE Models","title":"Density Projection / Atomic Base","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"We define the \"atomic density\"","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"rho(bm r) = sum_j delta(bm r - bm r_j)","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Then we choose a one-particle basis ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"phi_v(bm r) = phi_nlm(bm r) = R_n(r) Y_l^m(hatbm r)","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"and project rho` onto that basis, ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"A_v = A_nlm = langle phi_nlm rho rangle = \n   sum_j phi_nlm(bm r_j)","category":"page"},{"location":"gettingstarted/aceintro/#Density-correlations","page":"Introduction to ACE Models","title":"Density correlations","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Next, we form the N-correlations of the density, rho^otimes N and project them onto the tensor project basis, ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"   bm A_bm nlm \n   = Biglangle otimes_t = 1^N phi_n_t l_t m_t rho^otimes N Bigrangle \n   = prod_t = 1^N A_n_t l_t m_t","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"The reason to introduce these is that in the next step, the symmetrisation step the density project would loose all angular information while the N-correlations retain most (though not all) of it. ","category":"page"},{"location":"gettingstarted/aceintro/#Symmetrisation","page":"Introduction to ACE Models","title":"Symmetrisation","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Finally, we symmetrize the N-correlations, by integrating over the O(3)-Haar measure, ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"  B_bm nlm propto \n  int_O(3) bm A_bm nlm circ Q  dQ ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Because of properties of the spherical harmonics one can write this as ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"  bm B = mathcalU bm A","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"where bm A is the vector of 1, 2, ..., N correlations (the maximal N is an approximation parameter!) and mathcalU is a sparse matrix (the coupling coefficients).","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"If one symmetrised all possible N-correlations then this would create a spanning set, but one can easily reduce this to an actual basis. This construction then yields a basis of the space of symmetric polynomials. ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Notes: ","category":"page"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"Because of permutation symmetry only ordered bm v tuples are retained","category":"page"},{"location":"gettingstarted/aceintro/#Linear-Dependence","page":"Introduction to ACE Models","title":"Linear Dependence","text":"","category":"section"},{"location":"gettingstarted/aceintro/","page":"Introduction to ACE Models","title":"Introduction to ACE Models","text":"The construction described above introduces a lot of linear dependence which is removed in the ACE basis construction in a mixed symbolic / numerical procedure. In the end we no longer index the symmetrized basis functions as B_bm nlm but as B_bm nli with i indexing the linearly independent basis functions from the bm nl block. ","category":"page"},{"location":"gettingstarted/using/#Using-an-existing-ACE.jl-model","page":"Using an existing ACE.jl model","title":"Using an existing ACE.jl model","text":"","category":"section"},{"location":"gettingstarted/using/","page":"Using an existing ACE.jl model","title":"Using an existing ACE.jl model","text":"should provide examples of usage from ","category":"page"},{"location":"gettingstarted/using/","page":"Using an existing ACE.jl model","title":"Using an existing ACE.jl model","text":"Julia\nPython\nLammps\nOpenMM","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = ACE1docs","category":"page"},{"location":"#ACE1-User-Documentation","page":"Home","title":"ACE1 User Documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"tutorials/createsavefit/#creating-and-saving-a-fit","page":"creating and saving a fit","title":"creating and saving a fit","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"using ACE1 using IPFitting","category":"page"},{"location":"tutorials/createsavefit/#READING-IN-XYZ","page":"creating and saving a fit","title":"READING IN XYZ","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"al = IPFitting.Data.readxyz(@DIR() * \"/TiAltutorialDB.xyz\", energykey=\"energy\", forcekey=\"force\", virialkey=\"virial\")[1:10:end];","category":"page"},{"location":"tutorials/createsavefit/#TAKE-AVERAGE-TYPICAL-DISTANCE","page":"creating and saving a fit","title":"TAKE AVERAGE TYPICAL DISTANCE","text":"","category":"section"},{"location":"tutorials/createsavefit/#WE-CAN-DO-THIS-PAIR-SPECIFIC,-MAYBE-OTHER-NOTEBOOK?","page":"creating and saving a fit","title":"WE CAN DO THIS PAIR SPECIFIC, MAYBE OTHER NOTEBOOK?","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"r0 = 0.5*(rnn(:Ti) + rnn(:Al))","category":"page"},{"location":"tutorials/createsavefit/#SETTING-UP-ACE-BASIS","page":"creating and saving a fit","title":"SETTING UP ACE BASIS","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"ACEB = ACE1.Utils.rpibasis(species = [:Ti, :Al],                               N = 3,                               r0 = r0,                               rin = 0.6 * r0,                               rcut = 5.5,                               maxdeg = 6)","category":"page"},{"location":"tutorials/createsavefit/#PAIR-POTENTIAL","page":"creating and saving a fit","title":"PAIR POTENTIAL","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"Bpair = pair_basis(species = [:Ti, :Al],       r0 = r0,       maxdeg = 6,       rcut = 7.0,       pcut = 1,       pin = 0)   # pin = 0 means no inner cutoff","category":"page"},{"location":"tutorials/createsavefit/#COMBINED-BASIS-PAIR-ACE","page":"creating and saving a fit","title":"COMBINED BASIS PAIR + ACE","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"B = JuLIP.MLIPs.IPSuperBasis([Bpair, ACE_B]);","category":"page"},{"location":"tutorials/createsavefit/#CREATE-LEAST-SQUARES-SYSTEM,-\"\"-DOES-NOT-SAVE","page":"creating and saving a fit","title":"CREATE LEAST SQUARES SYSTEM, \"\" DOES NOT SAVE","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"dB = LsqDB(\"\", B, al)","category":"page"},{"location":"tutorials/createsavefit/#REFERENCE-POTENTIAL-CONTAINING-THE-E0S","page":"creating and saving a fit","title":"REFERENCE POTENTIAL CONTAINING THE E0S","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"Vref = OneBody(:Ti => -1586.0195, :Al => -105.5954)","category":"page"},{"location":"tutorials/createsavefit/#WEIGHTS-PER-CONFIG-TYPE","page":"creating and saving a fit","title":"WEIGHTS PER CONFIG TYPE","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"weights = Dict(         \"FLDTiAl\" => Dict(\"E\" => 5.0, \"F\" => 1.0 , \"V\" => 1.0 ),         \"TiAlT5000\" => Dict(\"E\" => 30.0, \"F\" => 1.0 , \"V\" => 1.0 ))","category":"page"},{"location":"tutorials/createsavefit/#LAPLACIAN-PRECONDITIONING,-IF-NOT-DEFINED-P-DEFAULTS-TO-DIAGONAL-MATRIX-(NO-PRECON)","page":"creating and saving a fit","title":"LAPLACIAN PRECONDITIONING, IF NOT DEFINED P DEFAULTS TO DIAGONAL MATRIX (NO PRECON)","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"using LinearAlgebra rlapscal = 3.0 P = Diagonal(vcat(ACE1.scaling.(dB.basis.BB, rlapscal)...))","category":"page"},{"location":"tutorials/createsavefit/#PERFORM-FIT","page":"creating and saving a fit","title":"PERFORM FIT","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"IP, lsqinfo = lsqfit(dB, weights=weights, Vref=Vref, asmerrs = true);","category":"page"},{"location":"tutorials/createsavefit/#ERROR-TABLE","page":"creating and saving a fit","title":"ERROR TABLE","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"#rmse_table(lsqinfo[\"errors\"])","category":"page"},{"location":"tutorials/createsavefit/#SAVE-POTENTIAL","page":"creating and saving a fit","title":"SAVE POTENTIAL","text":"","category":"section"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"savedict(\"./TiAltutorialpot.json\", Dict(\"IP\" => writedict(IP), \"info\" => lsqinfo))","category":"page"},{"location":"tutorials/createsavefit/","page":"creating and saving a fit","title":"creating and saving a fit","text":"ACE1.ExportMulti.exportACE(\"./TiAltutorial_pot.yace\", IP)","category":"page"}]
}

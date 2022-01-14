using ACEdocs
using Documenter

DocMeta.setdocmeta!(ACEdocs, :DocTestSetup, :(using ACEdocs); recursive=true)

makedocs(;
    modules=[ACEdocs],
    authors="Christoph Ortner <christophortner0@gmail.com> and contributors",
    repo="https://github.com/ACEsuit/ACEdocs.jl/blob/{commit}{path}#{line}",
    sitename="ACEdocs.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://ACEsuit.github.io/ACEdocs.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "Getting Started" => Any[
            "gettingstarted/aceintro.md",
            "gettingstarted/installation.md",
            "gettingstarted/using.md",
            "gettingstarted/developing.md",
        ],
        "IPFitting.jl" => "ipfitting.md", 
    ],
)

deploydocs(;
    repo="github.com/ACEsuit/ACEdocs.jl",
    devbranch="main",
)

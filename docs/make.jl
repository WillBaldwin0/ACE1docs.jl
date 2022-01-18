using ACE1docs
using Documenter

DocMeta.setdocmeta!(ACE1docs, :DocTestSetup, :(using ACE1docs); recursive=true)

makedocs(;
    modules=[ACE1docs],
    authors="Christoph Ortner <christophortner0@gmail.com> and contributors",
    repo="https://github.com/ACEsuit/ACE1docs.jl/blob/{commit}{path}#{line}",
    sitename="ACE1docs.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://ACEsuit.github.io/ACE1docs.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "Getting Started" => Any[
            "gettingstarted/aceintro.md",
            "gettingstarted/installation.md",
            "gettingstarted/using.md",
            "gettingstarted/developing.md",
            "gettingstarted/pkg.md",
        ],
        "IPFitting.jl" => "ipfitting.md", 
    ],
)

deploydocs(;
    repo="github.com/ACEsuit/ACE1docs.jl",
    devbranch="main",
)

var ptx_lunr_search_style = "textbook";
var ptx_lunr_docs = [
{
  "id": "frontmatter-1",
  "level": "1",
  "url": "frontmatter-1.html",
  "type": "Front Matter",
  "number": "",
  "title": "Front Matter",
  "body": "   David Austin    Volker Sorge     Diagrams are an important means of conveying information in mathematical subjects. However, their accessibility in electronic documents is still a rarity as even in online teaching and learning material, diagrams are commonly given in standard image formats leaving them inaccessible for visually impaired learners. In addition there is even less accessibility support for authoring diagrams with the majority of tools relying on WYSIWYG editors with inaccessible drag and drop interfaces. In our work we aim to support visually impaired learners and educators in both the authoring and reading tasks. The basic idea is to provide a simple, descriptive, yet powerful enough language that allows the easy generation of accessible diagrams, for everyone, so they can be used for communicating information to both their sighted and non-sighted peers. Accessibility can then be achieved by means of automatically annotating the diagram with information that can be exploited by assistive technology for visual adaptation, screen reading, or sonification.   "
},
{
  "id": "sec_intro",
  "level": "1",
  "url": "sec_intro.html",
  "type": "Section",
  "number": "1",
  "title": "Introduction",
  "body": " Introduction  Although mathematical literature forms the basis of many scientific and technical (STEM) subjects, they still pose a considerable hurdle for Visually impaired (VI) learners. While there has been emphasis on making formulas accessible and communicating xy-graphs with techniques like sonification , other mathematical diagrams have received considerably less attention. Furthermore, there is even less attention on aiding independent authoring of diagrams that not only makes it easy for VI learners to generate their own material but also to inspect its correctness and communicate it to their sighted peers.  Systems like Equatio or Desmos offer graphic calculator facilities that allow for easy generation of interactive graphics, offering a range of accessibility tools such as formula voicing and sonification. However, many of the input elements are still mainly designed for sighted users and the emphasis is mainly on xy-graphs. More traditional mathematical authoring methods include the production of graphics within the context of LaTeX typesetting using powerful graphing packages such as Pstricks or Tikz . In particular, TikZ has become the prevalent tool for authoring diagrams in scientific literature, including advanced mathematics, computer science, and theoretical physics. While undeniably powerful, its use frequently requires several cycles of visually inspecting the output and making subsequent adjustments. Moreover, while text and formulas of LaTeX documents can be made directly web-accessible, using tools like pandoc and MathJax , resulting graphics will still be inaccessible.  Our goal is to enable all authors to generate accessible mathematical diagrams easily by creating a high-level description of the mathematical components of the diagram using a provided language with a relatively small, but intuitive, vocabulary. And in particular we want to support VI authors by reducing the inspection cycles by offering a simpler, XML-based language that automates many routine tasks, such as drawing grids and placing labels, while still providing the flexibility to handle unusual situations. Resulting SVG graphics are made accessible with the diagcess library , which was initially designed for the generation of accessible chemical diagrams. The library allows readers to interactively engage with the created diagrams by exploring them step-wise and on different layers, enabling aural rendering and sonfication.  Our work is based in the context of PreTeXt, a tool that facilitates the creation of accessible scholarly documents. A PreTeXt author describes the structure of their document in XML while keeping the mathematical content in standard latex . Thus, similar to latex , documents are written without concern for their visual appearance while authoring, and PreTeXt will create an accessible version of the document in a variety of formats, such as HTML, PDF, ePub, or Braille. Our graphical authoring langugage is designed in a similar spirit and will eventually allow PreTeXt authors the ability to create accessible graphics directly in their documents. Some examples of diagrams that can be generated and made accessible with our technique are presented in Figure . We will use the top left-most as a running example.   Examples of targeted mathematical diagrams.                     "
},
{
  "id": "fig_examples",
  "level": "2",
  "url": "sec_intro.html#fig_examples",
  "type": "Figure",
  "number": "1.1",
  "title": "",
  "body": " Examples of targeted mathematical diagrams.                    "
},
{
  "id": "sec_diagramming",
  "level": "1",
  "url": "sec_diagramming.html",
  "type": "Section",
  "number": "2",
  "title": "Creating Accessible Diagrams",
  "body": " Creating Accessible Diagrams   Accessible mathematical diagrams are created through an XML description of the mathematical components of the diagram. Annotations are likewise included in a simple format that specifies how they are to be traversed using a screen reader. A Python script converts XML input directly into SVG output that can be viewed in a browser or sent to an embosser.    Basic Vocabulary  The basic diagram vocabulary, designed to mirror mathematical vocabulary, drives the SVG generation and can roughly be divided into five functional groups: (1) definitions, control, and grouping, (2) basic grids and axes, (3) one-dimensional objects, such as graphs and lines, (4) two-dimensional objects, such as areas and polygons, and (5) labels.  The XML description for the left-most diagram in Figure is given in . The graphics element specifies the basic dimension of a the output graphics. Note that since we are constructing a scalalable vector graphics this dimension only serves to give the aspect ratio of the resulting diagram. It is however relevant for PreTeXt to compile the graphics for inclusion in PDF output.   XML description for the left-most diagram in Figure   <graphics id=\"figure\" width=\"300\" height=\"300\" margins=\"5\"> <boundingbox mbox=\"[-4,-4,4,4]\"\/> <grid-axes xlabel=\"x\" ylabel=\"y\" \/> <variable name=\"a\" value=\"1\" \/> <function expr=\"f(x) = exp(x\/3)*cos(x)\" \/> <group id=\"graph-tangent\"> <graph id=\"graph\" function=\"f\" stroke=\"blue\" \/> <tangent-line id=\"tangent\" function=\"f\" point=\"a\" stroke=\"red\" \/> <point id=\"point\" p=\"(a, f(a))\" fill=\"red\" label=\"(a, f(a))\" \/> <\/group> <\/graphics>    The boundingbox and grid-axes elements then specify the basic grid layout. In our case we use a grid with labeled -axis and -axis which are bounded to the range from to each. The following two elements are definitions for a variable and the basic function . Alone they have no graphical output, but are only referenced in later drawing commands. More precisely, graph command draws the function , while the tangent-line element draws the tangent at the point as we have previously defined . Finally we explicitly draw this tangent point with the point element, giving it a mathematical label of . Note, that this label is given in latex code and can be of any complexity as it will later be processed and typeset by MathJax.  Here the graph and the tangent line commands are grouped together with a group element. This works similar to its SVG counter part g and ensures that semantically related elements are grouped together in the resulting SVG diagram and that they can be annotated as a single, abstract element. In addition, each element can contain an id which allows the author to provide a individual, manual annotation as we discuss next.  The vocabulary currently supports the creation of mathematical diagrams that could appear in algebra and calculus textbooks. Some capabilities exist to create diagrams in other mathematical disciplines, such as linear algebra and discrete mathematics, and we plan to expand these capabilities and allow for the creation of three-dimensional content.    Annotating Diagrams  Annotations are included separately from the graphical descriptions since the order in which elements are drawn may differ from how they are traversed in a screen reader. The set of annotations forms a hierarchical structure that begins with a global description of the diagram and proceeds inward by nesting annotations to examine graphical elements in greater detail. This provides the basic interaction model that we use to allow readers to explore the diagram in detail, as we will discuss in the next section. Many common elements are annotated automatically, leading to a standardised user experience for VI learners or authors inspecting the diagram during the creation process when screen reading, exploring or sonifying a diagram. Nevertheless authors can also provide bespoke manual annotations directly.  The annotations that accompany our example diagram are given in . Note how the ids of the annotations either refer to element ids in the diagram specification or to standard names of elements such as grid and axes. The annotations define the layers of detail for the diagram, which can be arbitrarily deep. In the example we have a nesting depth of three: The top-most annotation provides a summary of the figure, followed by the description of the tangent graph. The latter is again broken down into the three component of graph, tangent line and tangent point, which reflect the drawn elements in the diagram as specified in . We see that description for the other the main components, the axes and the grid are not explicitly given. Those will be programmatically generated and included automatically. They could, however, be overwritten manually.   The annotations that accompany the example diagram   <annotations> <annotation id=\"figure\" text=\"The graph of a function and its tangent line at the point a equals 1\"> <annotation id=\"graph-tangent\" text=\"The graph and its tangent line\"> <annotation id=\"graph\" text=\"The graph of the function f\" sonify=\"yes\"\/> <annotation id=\"point\" text=\"The point a comma f of a\"\/> <annotation id=\"tangent\" text=\"The tangent line to the graph of f at the point\"\/> <\/annotation> <\/annotation> <\/annotations>    In addition to the single text attributes, anotation elements can also have a secondary speech attribute that allows the author to provide more details on a particular element. Other attributes allowed are a flag to indicate that a graph should be sonified or that the children of an annotation should form a circular structure. The latter can, for example, be used in graphics like the unit circle or the network graph in Figure to allow for circular navigation of the points of the circle or cycles in the graph.    Processing XML into SVG  A Python script processes the XML input into SVG graphical elements and creates the annotation hierarchy in accompanying XML. Additional graphical elements are included by default to improve the diagrams' accessibility. For example, a clear rectangle is included behind a label so that background features do not interfere with the label's legibility. Mathematical labels are processed using MathJax and placed automatically relative to a specified anchor. Braille labels created by MathJax are carefully positioned for accurate rendering on an embosser.   "
},
{
  "id": "tab_xml",
  "level": "2",
  "url": "sec_diagramming.html#tab_xml",
  "type": "Listing",
  "number": "2.1",
  "title": "",
  "body": " XML description for the left-most diagram in Figure   <graphics id=\"figure\" width=\"300\" height=\"300\" margins=\"5\"> <boundingbox mbox=\"[-4,-4,4,4]\"\/> <grid-axes xlabel=\"x\" ylabel=\"y\" \/> <variable name=\"a\" value=\"1\" \/> <function expr=\"f(x) = exp(x\/3)*cos(x)\" \/> <group id=\"graph-tangent\"> <graph id=\"graph\" function=\"f\" stroke=\"blue\" \/> <tangent-line id=\"tangent\" function=\"f\" point=\"a\" stroke=\"red\" \/> <point id=\"point\" p=\"(a, f(a))\" fill=\"red\" label=\"(a, f(a))\" \/> <\/group> <\/graphics>   "
},
{
  "id": "tab_Annotations",
  "level": "2",
  "url": "sec_diagramming.html#tab_Annotations",
  "type": "Listing",
  "number": "2.2",
  "title": "",
  "body": " The annotations that accompany the example diagram   <annotations> <annotation id=\"figure\" text=\"The graph of a function and its tangent line at the point a equals 1\"> <annotation id=\"graph-tangent\" text=\"The graph and its tangent line\"> <annotation id=\"graph\" text=\"The graph of the function f\" sonify=\"yes\"\/> <annotation id=\"point\" text=\"The point a comma f of a\"\/> <annotation id=\"tangent\" text=\"The tangent line to the graph of f at the point\"\/> <\/annotation> <\/annotation> <\/annotations>   "
},
{
  "id": "sec_accessible-diagrams",
  "level": "1",
  "url": "sec_accessible-diagrams.html",
  "type": "Section",
  "number": "3",
  "title": "Inspecting Accessible Diagrams",
  "body": " Inspecting Accessible Diagrams  The resulting SVG will be fully accessible and can be inspected in a browser either visually or via keyboard interaction, speech output and sonification. In addition, it is easy to generate alternate formats: Tactile graphics are generated by exploiting MathJax's ability to generate Braille for tactile formula labels. Similarly audio-tactile graphics can be produced that can work with the ViewPlus' Iveo technology by embedding the speech annotations as title and description elements into the SVG. This type of SVG can also be used in environments and ebook readers where no JavaScript is available, simulating navigation by a simple tabindex structure. However, in the remainder of the section we will explain accessibility for the browser provision.  We employ AJAX functionality to import both SVG and the XML annotations into a web page and inject the diagcess library to provide the bridge between annotations and graphical elements. The main feature of our accessible diagrams is the ability for a reader to interact with it via step-wise navigation. The basic browsing functionality is implemented by an explorer attached to the SVG element as event listener. A screenreader user is alerted to its existence via a dedicated ARIA label. The explorer can be entered via keystroke Enter or mouse click and left with Escape . Once the explorer is active, the user can navigate using the arrow keys and switch features, such as magnification, color changes, and sonification via additional keys. Technically these functionalities are realised as follows:     Aural Rendering is achieved by multiple means. Either directly by speaking using the browser's speech synthesis API or if a screen reader is used by updating a speech string in a DOM element designated as ARIA live region. In addition, speech can be presented as subtitles during navigation.   Highlighting is automatic and synchronised with the aural rendering so that elements are highlighted as they are being described. Highlighting is achieved by dynamically changing the CSS parameters of the SVG nodes concerned.   Color Adaptation is used to provide support for readers that benefit from high contrast as well as for easier integration into dark modes of browsers. While the application offers a number of default contrast models, these are customisable and adaptable to the surrounding text.   Magnification is an option of the explorer module and technically achieved via SVG animation, realising the zoom by gradually constraining the View Box of the SVG element to the components that are currently being described.   Sonification is optionally available for designated SVG polyline and paths elements using an oscillator model via the Web Audio API.    For browsing the diagram, we have chosen a relatively simple exploration model that was originally designed for working with chemical diagrams and honed in further user testing . Granularity and range of movement is determined by the annotation structure as described in the previous section.   Step-wise exploring the example diagram.              To illustrate, we observe the traversal of our example diagram in figure . Note how the subtitles correspond to the annotations presented in the previous section. Here the yellow highlights represent the components of the diagram under consideration. Initially the entire diagram is highlighted. When going Down , the axes are first announced with additional information, requested using the X key, giving the range of both the x and y axis. Moving Right on that level, we examine the graph and tangent line together. Going Down again we can inspect the function's graph while moving Right highlights the point and finally the tangent line. Both graphs can be sonified by pressing O . We then reach a boundary, indicated by an earcon, with a final Right .  Labels are treated distinctly to structural components of the diagram should they contain mathematical formulas. While they can be manually described by the author by providing a dedicated annotation element, we also exploit the fact that they are rendered with MathJax, which can provide accessibility support via the Speech Rule Engine . This means that formulas are rendered as SVG with an attached aria-label containing a corresponding speech string which can be localised or given in Braille. At the moment we only expose the top-most aria-label as an alternative to the manual description if one is given. However, SRE can also embed speech deeply into the rendered formula, with one speech string per subexpression, together with a navigation structure based on a semantic interpretation of the formula. This feature can be useful for more complex formulas as the differential equation in . We aim to integrate this as a future feature.  "
},
{
  "id": "fig_walking",
  "level": "2",
  "url": "sec_accessible-diagrams.html#fig_walking",
  "type": "Figure",
  "number": "3.1",
  "title": "",
  "body": " Step-wise exploring the example diagram.             "
},
{
  "id": "sec_conc",
  "level": "1",
  "url": "sec_conc.html",
  "type": "Section",
  "number": "4",
  "title": "Conclusions",
  "body": " Conclusions  We have presented a novel language for specifying accessible mathematics diagrams that allows for the automatic generation of accessible graphical content. And while its main purpose is to support VI authors in creating their own graphical content, the language design should also appeal to the general scientific community to easily draw and annotate graphics for their publications. And with the use of PreTeXt becoming more common the hope is that more and more scientific graphics will be born accessible in the future. Although our initial experience with the language is positive, we still need to experiment in detail with the vocabulary to ensure that it is fit for purpose. On the other hand we have user tested our navigation model in a number of projects and are confident that it is helpful. Features that we aim to add in the near future are to allow the exploration of complex equations in more depth with MathJax as well as to provide sonfication of groups of curves by using multiple frequencies.  "
},
{
  "id": "acknowledgement-1",
  "level": "1",
  "url": "acknowledgement-1.html",
  "type": "Acknowledgements",
  "number": "",
  "title": "Acknowledgements",
  "body": " Partial support for this work was provided by the \\grantsponsor{National Science Foundation}'s Improving Undergraduate STEM Education (IUSE) program under Award No. 1821706. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.  We are also grateful to the American Institute of Mathematics for funding, the National Federation of the Blind for hosting a workshop on Tactile Mathematical Textbooks, which helped us to get started with this work, and David Farmer for helping with the creation of the PreTeXt version of this paper.  "
},
{
  "id": "references-1",
  "level": "1",
  "url": "references-1.html",
  "type": "References",
  "number": "",
  "title": "Bibliography",
  "body": " Bibliography  Davide Cervone and Volker Sorge. Mathjax v3.2. , April 2022.  Desmos. Graphing calculator. .  Raymond M Fish. An audio display for the blind. IEEE transactions on bio-medical engineering , 1976.  A. Jonathan R. Godfrey, Paul Murray, and Volker Sorge. An accessible interaction model for data visualisation in statistics. In International Conference on Computers Helping People with Special Needs . Springer, 2018.  T. Hermann, A. Hunt, and J.G. Neuhoff. The Sonification Handbook . Logos Publishing House, 2011.  John MacFarlane, Jesse Rosenthal, Albert Krewinkel, Matthew Pickering, Mauro Bieg, Andrew Dunning, Nikolay Yakimov, Kolen Cheung, Yan Pashkovsky, Václav Haisman, et al. Pandoc. Zenodo .  D Parkes. Nomad: enabling access to graphics and text based information for blind, visually impaired and other disability groups. In Technology for People with Disabilities , volume 5, pages 690-714, 1991.   PSTricks .   TV Raman. Aster: Audio system for technical readings. Information Technology and Disabilities , 1, 1994.  Volker Sorge. Speech rule engine, v4. , 2022.  Volker Sorge, Mark Lee, and Sandy Wilkinson. End-to-end solution for accessible chemical diagrams. In Proceedings of the 12th Web for All Conference . ACM, 2015.  Till Tantau. The TikZ and PGF Packages . , 2023.  Texthelp. Equatio. .  "
}
]

var ptx_lunr_idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('body')

  ptx_lunr_docs.forEach(function (doc) {
    this.add(doc)
  }, this)
})

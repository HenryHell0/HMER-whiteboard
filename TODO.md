# PLAN

# wee woo wee woo first thing we wanna do is make it so that the wigets are getting an ID and mutating the widget object directly. take a look at how its done in widget.vue

- also extract widget toolbar
- also extract toolbar button and clean that up

next, I want to finish up graphs and figure out how exaclty I want them to look
I also want to rework the toolbar to support a button to add a blank graph.

- !!!! MORE IMPORTANTLY FIX THE CURSOR AND THE HOVERING WITH THE POINTER EVENTS: NONE ON THE WIDGETS FOR THE GRAPH DRAGGING!!!!

### solving component _hard!_

_note that when we do this we will have to switch backend to FastAPI and change vite proxies_

- _10/26/25_ Sun- create web server and test on test application with SymPy API
- _10/27/25_ Mon - add solve button and get response from SymPy API - potentially start on tomorrow’s stuff
- _10/28/25_ Tuesday - work on parsing(?) of SymPy response - research SymPy API functions more
- _10/29/25_ Wed - keep working with SymPy - potentially start on “solution” component
- _10/30/25_ Thu - Finish solution component & stuff - polish everything

---

### Other stuff TODO:

- add menu bar and little info icons
- add little tip icon when you do something
- add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute

## COOL OTHER STUFF TO DO!!!

_priority from 0/10 + type_

- 11 fix - finish the damn app
- 10 feature - UNDO and REDO button!
- 10 feature - editable expression component!
- 4 polish(sorta) - make a robust way to that when you do something with an expression it loads and then does it
- 8 polish - make a minimum resize and CLAMP THE DAMN POSITION (easy actually)
- 4 polish - an info/credits button in the right
- 2 polish - a little tutorial when you start
- 2 polish - switch HMER select button to having a little AI star

Graphs:

- make it so that removing an equation turns it back into an expression or deletes it (user chooses)
- make it so the padding color is the color of the graph!! (use desmos pallete option too, also make it so you can show/hide graphs!, and import/export)

DONE:

- 9 feature - make the expression you drag to go on top
- easy - make it so that hovering while holding an expression gives a nice background

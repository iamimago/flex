# Project Flex

## Idea
I want to build a website which implements neural network as an background animation game played by two evolving different ai networks... while also serving as an ordinary website including standard website stuff, mostly my resume and some information about me and eventual company. The idea is that every client will get the lastest update of both neural networks, and then perform calculations to develop both enteties where they try to eliminate the other in a preset of rules described below. The winner of the two ai networks stays, the loser gets discarded... I think, still not 100% sure on the AI details.

So the thought is to implement some sort of natural 'survival of the fittest' by having two different ai networks continiously fight each other with the exact same gamerules and constantly evolve their internal neurons to get an edge. The goal is to see the networks over time develop different 'strategies' and continiously outsmart each other somehow. We'll see about that.

### Resources
I will use a Node.js server, an iframe for reporting the AI results, implement the neural network in pure JS, potentially as a worker if i deem it necissary but it seems to be obsolete. The game engine will be rendered using webgl, primarily three.js cuz GLSL is really annoying and learning how to handle shaders would take too long. 

### Performance handling
To speed up the learning process of both enteties i also want to develop some sort of dynamic resource manager, which always ensures 60 fps, but the extra processing power depending on client hardware is utilized to calcualte further simulations which aren't shown. The idea is to use TCP-congestion control like schema to decide the amount of extra ai calculations ongoing, where the congenstion window isn't segments but amount of extra calculation sessions. If the processing takes too long, it's seen as a 'packet loss' and the amount is reset, just like congestion control. If the the website cannot ensure 60 fps, it will simply play a non-ai background (unless the user opts in manually).


## AI
The AI will be a version of 'Actung die curve' and 'Snake'. The objective to the game is to collect green balls to grow a larger tail, and to survive for as long as possible. You're playing as a ball which is constantly moving forward, being controlled by moving clockwise or counter clockwise (arrow keys or "A"/"D"). If you hit a wall of the canvas or the any tail (your own or the oponents) you lose. Initial idea is to only have two players, but thinking about it this could support as quite a few, especially if scaling is introduced.


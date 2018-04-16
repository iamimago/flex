# Project Flex

## Idea
I want to build a website which implements neural network as an background animation game played by two evolving different ai networks... while also serving as an ordinary website including standard website stuff, mostly my resume and some information about me and eventual company. The idea is that every client will get the lastest update of both neural networks, and then perform calculations to develop both enteties where they try to eliminate the other in a preset of rules described below. The winner of the two ai networks stays, the loser gets discarded... I think, still not 100% sure on the AI details.

So the thought is to implement some sort of natural 'survival of the fittest' by having two different ai networks continiously fight each other with the exact same gamerules and constantly evolve their internal neurons to get an edge. The goal is to see the networks over time develop different 'strategies' and continiously outsmart each other somehow. We'll see about that. 

### Performance handling
To speed up the learning process of both enteties i also want to develop some sort of dynamic resource manager, which always ensures 60 fps, but the extra processing power depending on client hardware is utilized to calcualte further simulations which aren't shown. The idea is to use TCP-congestion control like schema to decide the amount of extra ai calculations ongoing, where the congenstion window isn't segments but amount of extra calculation sessions. If the processing takes too long, it's seen as a 'packet loss' and the amount is reset, just like congestion control. If the the website cannot ensure 60 fps, it will simply play a non-ai background (unless the user opts in manually).


### Morals
The idea is basically pretty scummy. It's a calculation botnet of sorts, where the clients who visits blissfully and continiously develop a neural network, they dont notice it at all, doesn't affect any performance, but i get 'useful' calculations done. Just using neural networks is mostly a placeholder for whatever calculations which might be needed in some future project, this concept is the original idea. My first intent were to mine bitcoin, but that would be very slightly too immoral, and ai is more interesting than blockchain.

I justify this sort of concept by always ensuring the most effective code I can program, and also to never disturb the users experience. My reasoning is that there's plenty of really crappy and unoptimized code out there which just does nothing good at all and still slow down peoples systems, so i sort of do this intentionally and earn some processing power myself, while being transparent with it and not affecting the user experience. I'm pretty sure this sort of system isn't illegal... Maybe. As long as I dont earn money from it, it should be fine.


## AI (... still in need of figuring out. More to come summer 2018)


## Resources:

It should use canvas, tensorflow.js

# Development milestones:

## Game implementation

1. Implement drawing function
    1. Moveable circle
        * Automoving, as in the other thing                         ==DONE==
        * Turning with A and D                                      ==DONE==
    2. Tail of moveable circle                  
        * Fixed size                                                ==DONE==
        * Dynamic size                                              ==DONE== 
    3. Static objects                                               ==DONE==
2. Implement item detection                                         ==DONE==
-- Engine should be done enough                 

3. Implement point system                                          ==DONE==
    1. Back end only. Console.log it.                              ==DONE==
4. Implement "apples" which extends tail on collision              ==DONE==
5. Implement game over when player intersects with other player    ==DONE==

-- Game should be done enough

## Tensorflow implementation
1. Implement tensorflow.js
    1. Basic feed forward network
    2. Reinforcement learning
    3. Genetic algorithm 
        1. Using modified scaledown versions of the game running in the background
        2. Still using the same pixel logic for item detection, just out of view
        3. Implement TCP-like congestion control for background genetic algorithms
2. Construct simple system where server feeds the best NN to client
    1. Construct JSON submission server -> client -> client plays -> submitt to server.

-- AI and backend should be done enough now

## Optimizations
1. Optimize enough for this to actually run smoothly in 60 fps. It is possible. You're just not smart enough. 
--- flex 0.1 is now done!

## Graphical development update (if i get here):

## Notes
ISSUES: How does the NN get the trail data? 
SOLUTION: It doesn't. 
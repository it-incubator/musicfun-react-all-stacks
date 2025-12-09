@src/player/ inside this folder now we have 2 files. I need redux slice wrapper around Audio instance

- in one moment only single track can be player
- we can pause track and continues playing from the same moment.
- if we start play new track the track starts from begin.
- we can have ability send to redux info about all playlist inside which playing track exists. Beacaude we next functionlity:
  - when track fininsh next song from playlist should play
  - or other rundom track from player should play
  - or the same track should repeat
    depends on current mode: repeat one, repeat all, repeat off, shuffle...

suggest solution and create full doc about this task. i forgot somethig important so add additional
requirements in this specification
to make good functional player.

concentrate only on Business logic. But u can give me examles of compoennt and how to use this inside component.

Each component that render track should be able to visualize track state: is playing, is paused, and progress bar if
component's track is playing or paused track

create selectors, think about perfomance: on the page we will have hundreds of tracks, so we should rerender each track compoennt
if theirs track is different of current paused/played track

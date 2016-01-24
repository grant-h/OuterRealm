var Tune = function (song) {
    var _songRef =  song;
    var _snd = new Audio;
    var _cachedTime = undefined;
    _snd.src = song;

    _snd.addEventListener("play", function() {
        if(_cachedTime !== undefined) {
            console.log("[Tune] setting time", _cachedTime);
            _snd.currentTime = _cachedTime;
            _cachedTime = undefined;
        }
    });

    function start() {
        _snd.currentTime = 0;
        play();
    }

    function play() {
        _snd.play();
    }

    function stop() {
        _snd.stop()
    }

    function pause() {
        _snd.pause();
    }

    function restart() {
        pause();
        _snd.currentTime = 0;
        play();
    }

    function position() {
        return _snd.currentTime;
    }

    function seek(time) {
        //console.log("seek inner", time);

        if(isPaused()) {
            //_cachedTime = time;
        } else {
            _snd.currentTime = time;
            //_snd.currentTime = time;
        }
    }

    function isPaused() {
       return _snd.paused;
    }

    return {
        stop : stop,
        start : start,
        play : play,
        pause : pause,
        restart : restart,
        position : position,
        seek : seek,
        isPaused : isPaused
    }
}


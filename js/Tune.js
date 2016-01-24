var Tune = function (song) {
    var _songRef =  song;
    var _snd = new Audio;
    var _cachedTime = undefined;
    _snd.src = song;

    /*_snd.addEventListener("pause", function() {
        console.log("[Tune] paused", _cachedTime);
        if(_cachedTime !== undefined) {
            _snd.currentTime = _cachedTime;
            _cachedTime = undefined;
            console.log("[Tune] result", _snd.currentTime);
        }
    });*/

    function start() {
        _snd.currentTime = 0;
        play();
    }

    function play(cb) {
        if(cb !== undefined) {
            var fn = function () {
                cb();
                _snd.removeEventListener("play", fn)
            };
            _snd.addEventListener("play", fn);
        }

        _snd.play();
    }

    function stop() {
        _snd.pause();
        _snd.currentTime = 0;
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
        //_snd.pause();
        _snd.currentTime = time;
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


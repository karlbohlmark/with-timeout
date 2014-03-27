module.exports = withTimeout

function withTimeout(fn, timeout) {
    return function () {
        var timedOut = false
        var done = false
        var args = [].slice.call(arguments)
        var cb = args.pop()
        function callback(err, res) {
            if (!timedOut) {
                done = true
                cb(err, res)
            }
        }
        args.push(callback)
        var res = fn.apply(null, args)
        setTimeout(function () {
            if (done) return
            timedOut = true
            var err = new Error("Async call timed out")
            err.timeout = timeout
            cb(err)
        }, timeout)
        return res
    }
}
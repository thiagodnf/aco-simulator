class NormalizeUtils {

    static normalizeAnyInterval(x, min, max, a, b) {
        return (b - a) * ((x - min) / (max - min)) + a;
    }

    static normalize(x, min, max) {
        return NormalizeUtils.normalizeAnyInterval(x, min, max, 0.0, 1.0);
    }
}

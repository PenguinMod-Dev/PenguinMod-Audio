const Effect = require('./Effect');

/**
 * Affect the volume of an effect chain.
 */
class VolumeEffect extends Effect {
    /**
     * Default value to set the Effect to when constructed and when clear'ed.
     * @const {number}
     */
    get DEFAULT_VALUE () {
        return 100;
    }

    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize () {
        this.inputNode = this.audioEngine.audioContext.createGain();
        this.outputNode = this.inputNode;

        this.initialized = true;
    }

    /**
     * Set the effects value.
     * @private
     * @param {number} value - new value to set effect to
     */
    _set (value) {
        this.value = value;

        const {gain} = this.outputNode;
        const {audioContext: {currentTime}, DECAY_TIME} = this.audioEngine;
        gain.setValueAtTime(gain.value, currentTime);
        gain.linearRampToValueAtTime(value / 100, currentTime + DECAY_TIME);
    }

    /**
     * Clean up and disconnect audio nodes.
     */
    dispose () {
        if (!this.initialized) {
            return;
        }

        this.outputNode.disconnect();

        this.inputNode = null;
        this.outputNode = null;
        this.target = null;

        this.initialized = false;
    }
}

module.exports = VolumeEffect;
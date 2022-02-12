const positionResetProjection = {
    $init: () => {
        return {
            sequence: 0,
        };
    },
    PositionReset: (projection, event) => {
        projection.sequence = event.globalPosition;

        return projection;
    },
};

module.exports = positionResetProjection;

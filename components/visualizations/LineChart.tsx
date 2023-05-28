// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from '@nivo/line';
import consts from 'const';
import { prettyNumberFormat } from 'utils';
import { Typography, Box } from '@material-ui/core';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const LineChart = ({ data }) => (
    <ResponsiveLine
        data={data}
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
        }}
        colors={() => consts.logoColors.veryDarkBlue}
        lineWidth={3}
        margin={{ top: 10, right: 10, bottom: 40, left: 70 }}
        xFormat={(value) => {
            var options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
            var dt  = new Date(value);
            return dt.toLocaleDateString("en-US", options);
        }}
        yFormat={(value) => prettyNumberFormat(value, true, true, false)}
        enableGridY={false}
        enableGridX={false}
        yScale={{
            type: 'linear',
        }}
        axisLeft={{
            legend: 'Typical home prices',
            legendOffset: -60,
            legendPosition: 'middle',
            format: function(value) {
                return prettyNumberFormat(value, true, true, false);
            },
        }}
        axisBottom={{
            format: '%Y',
        }}
        pointSize={0}
        pointBorderWidth={0}
        useMesh={true}
        enableSlices="x"
        enableArea={data.length == 1}
        sliceTooltip={({ slice }) => {
            return (
                <Box
                    padding={4}
                    style={{
                        background: 'white',
                        border: '1px solid #ccc',
                        opacity: '0.95'
                    }}
                >
                    <Typography variant="h4">{slice.points[0].data.xFormatted}</Typography>
                    {slice.points.map(point => {
                        return (
                            <Box paddingTop={4}>
                                <Typography
                                    key={point.id}
                                >
                                <strong>Typical home price:</strong> {point.data.yFormatted}
                                </Typography>
                            </Box>
                        )
                        })
                    }
                </Box>
            );
        }}
    />
)

export default LineChart
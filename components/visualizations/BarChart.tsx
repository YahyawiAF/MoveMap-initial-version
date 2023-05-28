// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveBar } from '@nivo/bar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const BarChart = ({
  data,
  onClick
}) => {
  return (<ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="city"
        colors={({ data }) => String(data['color'])}
        margin={{
          right: 20,
          bottom: 20,
          left: 160
        }}
        onClick={onClick}
        layout="horizontal"
        enableGridX={true}
        enableGridY={false}
    />
)}

export default BarChart
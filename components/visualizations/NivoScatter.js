import { ResponsiveScatterPlot } from '@nivo/scatterplot'

const NivoScatterplot = ({
  data,
  onClick
}) => {
  return (<ResponsiveScatterPlot
        data={data}
        keys={['value']}
        indexBy="city"
        colors={(data) => {
          return 'red'
        }}
        margin={{
          right: 20,
          bottom: 20,
          left: 160
        }}
        onClick={onClick}
    />
)}

export default NivoScatterplot
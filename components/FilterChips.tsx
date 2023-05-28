import { Box } from '@material-ui/core';
import consts from 'const';
import FilterChip from 'components/FilterChip';
import { useRouter } from 'next/router';

const FilterChips = () => {
  const router = useRouter();
  const urlParamKeys = Object.keys(router.query);
  const filterKeys = Object.keys(consts.filters);
  return (
    <Box display="flex" flexWrap="wrap">
      {urlParamKeys.map(urlKey => {
        const matchingFilterKey = filterKeys.find(filterKey => {
          const filterData = consts.filters[filterKey];
          return filterData.urlKey == urlKey
        })
        const data = consts.filters[matchingFilterKey]
        return (
          data 
          ? <FilterChip
            key={matchingFilterKey}
            data={data} 
          />
          : null
        )})
      }
    </Box>
  )
};

export default FilterChips;
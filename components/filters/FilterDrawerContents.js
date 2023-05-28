import { Box } from '@material-ui/core';
import SliderFilter from 'components/filters/SliderFilter';
import consts from 'const';
import FilterGroup from 'components/filters/FilterGroup';
import DropDownFilterMultiselect from 'components/filters/DropDownFilterMultiselect';
import { useRouter } from 'next/router';
import SwitchFilter from 'components/filters/SwitchFilter';
import DropDownSingleselect from 'components/filters/DropDownFilterSingleselect';
import { useEffect } from 'react';
import { setRouteParams, prettyNumberFormat } from 'utils';
import { useLoading } from "lib/LoadingContext";

const FilterDrawerContents = ({rentOrBuyKey}) => {
  const router = useRouter();
  const isBuy = rentOrBuyKey == consts.rentOrBuyOptions.buy.value;
  const { setLoading } = useLoading();

  useEffect(() => {
    if (router.query[consts.rentOrBuyUrlKey]) {
      // clean up url params if we switch between rent and buy
      const isBuy = rentOrBuyKey == consts.rentOrBuyOptions.buy.value;
      const newQuery = {...router.query};
      if (isBuy) {
        delete newQuery[consts.filters.rentPrice.urlKey]
      } else {
        delete newQuery[consts.filters.homePrice.urlKey]
      }
      setRouteParams(newQuery, router, setLoading);
    }
  }, [rentOrBuyKey])

  return (
    <Box display="flex" flexDirection="column" spacing={0} width="100%" paddingTop={2}>
      <FilterGroup title="Cost of Living">
          <DropDownSingleselect 
            data={{
              urlKey: consts.rentOrBuyUrlKey,
              options: consts.rentOrBuyOptions,
              optionsOrder: [
                  consts.rentOrBuyOptions.buy.value,
                  consts.rentOrBuyOptions.rent.value
                ],
              friendlyName: consts.rentOrBuyFriendlyName
            }}
          />
          {isBuy && 
            <SliderFilter 
              data={consts.filters.homePrice}
          />}
          {!isBuy &&
            <SliderFilter 
                data={consts.filters.rentPrice}
            />
          }
          <SliderFilter 
            data={consts.filters.taxBurden}
          />
      </FilterGroup>
      <FilterGroup title="Terrain & Weather" >
        <Box >
          <Box>
            <Box>
              <DropDownSingleselect
                data={consts.filters.mountains}
              />
            </Box>
            <Box >  
              <DropDownSingleselect data={consts.filters.coast}/>
            </Box>
          </Box>
        </Box>
          <SliderFilter 
            data={consts.filters.heatIndex}
          />
          <SliderFilter 
            data={consts.filters.winterTemp}
          />
        <Box >
          <DropDownFilterMultiselect
            data={consts.filters.sunshine}
          />
        </Box>
        <Box >
          <DropDownFilterMultiselect
            data={consts.filters.precipitation}
          />
        </Box>
      </FilterGroup>
      <FilterGroup title="Canabis legality" >
      <Box >
          <Box>
            <Box>
              <DropDownSingleselect
                data={consts.filters.canabis}
              />
            </Box>
          </Box>
        </Box>
      </FilterGroup>
      <FilterGroup title="Demographics & Amenities" >
        <Box >
          <SwitchFilter data={consts.filters.metro} />
        </Box>
        <Box >
          <SwitchFilter data={consts.filters.airport} />
        </Box>
        <SliderFilter 
          data={consts.filters.pctAdultsBA}
        />
        <SliderFilter 
          data={consts.filters.medianAge}
        />
        <Box >
          <DropDownFilterMultiselect
            data={consts.filters.politics}
          />
        </Box>
        <SliderFilter 
          data={consts.filters.testScores}
        />
      </FilterGroup>
    </Box>
  )
};

export default FilterDrawerContents;
import { useEffect, useState, useReducer, useMemo } from "react";
import { fetchContinents } from "./utils/fetch-continents";
import style from './assets/app.module.css';
import DropdownMenu, { Option } from "./components/dropdownMenu";
import { ContinentCode, Continents, Countries, CountryCode } from "./types/api";
import { fetchCountries } from "./utils/fetch-countries";

type Status = 'idle' | 'loading' | 'loaded';

type ContinentState = {
  status: Status,
  data: Continents | null | undefined,
}

type ContinentAction = {
  type: 'loaded' | 'loading',
  payload?: Continents | null | undefined,
}

type CountryState = {
  status: Status,
  data: Countries | null | undefined,
}

type CountryAction = {
  type: 'loaded' | 'loading',
  payload?: Countries | null | undefined,
}

function App() {
  const [continent, setContinent] = useState<String | null | undefined>(null);
  const [country, setCountry] = useState<String | null | undefined>(null);

  const warning = useMemo(() => country === 'KP', [country]);

  useEffect(() => {
    setCountry(null);
  }, [continent])

  const initialContinentState: ContinentState = {
    status: "idle",
    data: null,
  };

  const initialCountryState: CountryState = {
    status: "idle",
    data: null,
  };

  const countryReducer = (state: CountryState, action: CountryAction): CountryState => {
    switch (action.type) {
      case 'loading':
        return {
          ...state,
          status: 'loading',
        }

      case 'loaded':
        return {
          ...state,
          status: 'loaded',
          data: action?.payload,
        }
      default:
        return state;
    }
  }

  const continentReducer = (state: ContinentState, action: ContinentAction): ContinentState => {
    switch (action.type) {
      case 'loading':
        return {
          ...state,
          status: 'loading',
        }

      case 'loaded':
        return {
          ...state,
          status: 'loaded',
          data: action?.payload,
        }
      default:
        return state;
    }
  }

  const [continentData, dispatchContinent] = useReducer(continentReducer, initialContinentState);
  const [countryData, dispatchCountry] = useReducer(countryReducer, initialCountryState);

  const setence = useMemo(() => {
    if (continent && country) {
      const continentName = continentData.data?.[continent as ContinentCode]
      const countryName = countryData.data?.[country as CountryCode]?.name
      return `I am going to ${countryName} in ${continentName}!`
    }
    return '';
  }, [continent, country]);


  const continentValues = useMemo((): Option[] => {
    return Object.keys(continentData.data || {}).map((key): Option => ({ value: key, label: continentData.data?.[key as ContinentCode] }))
  }, [continentData.data]);

  const filteredCountryList = useMemo(() => {
    if(continent){
      let list: Option[] = [];

      Object.keys(countryData.data || {}).forEach((countryCode) => {
        if (countryData.data?.[countryCode as CountryCode].continent === continent) {
          list.push({
            value: countryCode,
            label: countryData.data?.[countryCode as CountryCode]?.name,
          });
        }
      });

      return list;
    }
    return [];
  }, [ continent ]);

  useEffect(() => {

    dispatchContinent({ type: "loading" });
    fetchContinents().then(res => {
      dispatchContinent({ type: 'loaded', payload: res })
    });

    dispatchCountry({ type: "loading" });
    fetchCountries().then(res => {
      dispatchCountry({ type: 'loaded', payload: res })
    });
  }, [])

  return (
    <div className={style.root}>
      <div className={style.wrapper}>
        <p>Please select a country you want to go.</p>
        <small>Try to select North Korea</small>

        <br />
        <br />

        <div>
          <DropdownMenu
            values={continentValues}
            onChange={(val) => setContinent(val)}
            placeholder="Select a continent"
          />
        </div>

        <br />
        <br />

        <div>
          <DropdownMenu
            values={filteredCountryList}
            selected={country}
            onChange={(val) => setCountry(val)}
            placeholder="Select a country"
            disabled={!continent}
            {...warning && {
              error: true,
              errorMessage: 'Are you sure you want to go this country?',
            }}
          />
        </div>

        <br />
        <br />

        <p>{setence}</p>
      </div>
    </div>
  );
}

export default App;

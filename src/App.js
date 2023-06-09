import React from "react";
import "./index.css";
import * as d3 from "d3";

const margin = { top: 5, right: 10, bottom: 60, left: 70 },
    width = 990 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    color = "OrangeRed";

const Chart = () => {
    const [activeIndex, setActiveIndex] = React.useState(null),
        [data, setData] = React.useState([]);

    React.useEffect(() => {
      // When reading the csv, I must format variables:
        d3.csv("https://raw.githubusercontent.com/jukuznets/datasets/main/usd-2020.csv").then((d) => {
            d = d.reverse();
            const parseDate = d3.timeParse("%m/%d/%Y");
            d.forEach((i) => {
                i.date = parseDate(i.date);
                i.price = Number(i.price);
            });
            setData(d);
          });
          return () => undefined;
      }, []);
      console.log(data);
    const yMinValue = d3.min(data, (d) => d.price),
        yMaxValue = d3.max(data, (d) => d.price);

        // Add X axis --> it is a date format
    const getX = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width]);

        // Add Y axis
    const getY = d3
        .scaleLinear()
        .domain([yMinValue - 1, yMaxValue + 2])
        .range([height, 0]);

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(getX);
        d3.select(ref).call(xAxis.tickFormat(d3.timeFormat("%b")));
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(7);
        d3.select(ref).call(yAxis);
    };

    const linePath = d3
        .line()
        .x((d) => getX(d.date))
        .y((d) => getY(d.price))
        .curve(d3.curveMonotoneX)(data);

    const areaPath = d3
        .area()
        .x((d) => getX(d.date))
        .y0((d) => getY(d.price))
        .y1(() => getY(yMinValue - 1))
        .curve(d3.curveMonotoneX)(data);

    const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.date).left,
            x0 = getX.invert(d3.pointer(e, this)[0]),
            index = bisect(data, x0, 1);
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
      <div className="wrapper">
          <svg
              viewBox={`0 0 ${width + margin.left + margin.right} 
                              ${height + margin.top + margin.bottom}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
          >
              <g className="axis" ref={getYAxis} />
              <g
                  className="axis xAxis"
                  ref={getXAxis}
                  transform={`translate(0,${height})`}
              />
              <path fill={color} d={areaPath} opacity={0.3} />
              <path strokeWidth={3} fill="none" stroke={color} d={linePath} />

              <text
                  transform={"rotate(-90)"}
                  x={0 - height / 2} y={0 - margin.left} dy="1em">
                  {"USD"}
              </text>
              <text
                  x={width / 2} y={0 - margin.top / 2} text-anchor="middle" >
                  {"USD to Russian Rubble Exchange Rates, 2020"}
              </text>
              <a
                  className="subtitle"
                  href="https://www.moex.com/ru/index/rtsusdcur.aspx?tid=2552"
                  target="_blank">
                  <text x="0" y={height + 50}>
                      {"Source: Moscow Exchange"}
                  </text>
              </a>

              {data.map((item, index) => {
                  return (
                      <g key={index}>
                          <text
                              fill="#666"
                              x={getX(item.date)}
                              y={getY(item.price) - 20}
                              textAnchor="middle"
                          >
                              {index === activeIndex ? item.price : ""}
                          </text>
                          <circle
                              cx={getX(item.date)}
                              cy={getY(item.price)}
                              r={index === activeIndex ? 6 : 4}
                              fill={color}
                              strokeWidth={index === activeIndex ? 2 : 0}
                              stroke="#fff"
                              style={{ transition: "ease-out .1s" }}
                          />
                      </g>
                  );
              })}
          </svg>
      </div>
    );
};

 export default Chart;
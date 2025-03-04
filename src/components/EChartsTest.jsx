import { useEffect, useState } from "react";
import Papa from "papaparse";
import ReactECharts from "echarts-for-react";

const EChartsTest = () => {
  const [dados, setDados] = useState([]);
  const [countByStatus, setCountByStatus] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/files/data.csv")
      .then((r) => r.text())
      .then((text) => {
        const data = Papa.parse(text, { header: true, skipEmptyLines: true });
        console.log(data.data);
        setDados(data.data);

        const countStatus = data.data.reduce((acc, cur) => {
          acc[cur.status_expiracao] = (acc[cur.status_expiracao] || 0) + 1;
          return acc;
        }, {});

        setCountByStatus(countStatus);
        setTotal(
          Object.values(countStatus).reduce((sum, value) => sum + value, 0)
        );
        console.log(`countStatus: ${JSON.stringify(countStatus)}`);
      });
  }, []);

  const colors = {
    A: "#FF5733", // Vermelho
    P: "#FFC300", // Amarelo
    E: "#4CAF50", // Verde
  };

  const barOption = {
    title: {
      text: "Análise de Expiração",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      data: Object.keys(countByStatus),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Quantidade",
        type: "bar",
        data: Object.keys(countByStatus).map((key) => ({
          value: countByStatus[key],
          itemStyle: {
            color: colors[key] || "#000000",
          },
        })),
        animationDuration: 1000,
        animationEasing: "cubicInOut",
      },
    ],
  };

  const pieOption = {
    title: {
      text: "Percentual de Expiração",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        name: "Percentual",
        type: "pie",
        radius: "50%",
        data: Object.keys(countByStatus).map((key) => ({
          name: key,
          value: ((countByStatus[key] / total) * 100).toFixed(2),
          itemStyle: {
            color: colors[key] || "#000000",
          },
        })),
      },
    ],
  };

  return (
    <div>
      <h1>My ECharts Test</h1>
      <ReactECharts option={barOption} style={{ height: 400 }} />
      <ReactECharts option={pieOption} style={{ height: 400 }} />
      <table className="table table-striped table-bordered">
        <caption>Lista de Dados</caption>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "70%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((dado, index) => (
            <tr key={index}>
              <td>{dado.id}</td>
              <td>{dado.status_expiracao}</td>
              <td>{dado.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EChartsTest;

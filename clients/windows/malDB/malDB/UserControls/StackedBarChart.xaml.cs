using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using LiveCharts;
using LiveCharts.Wpf;

namespace malDB.UserControls
{
    /// <summary>
    /// Interaction logic for StackedBarChart.xaml
    /// </summary>
    public partial class StackedBarChart : UserControl
    {
        public SeriesCollection SeriesCollection { get; set; }
        public string[] Labels { get; set; }
        public Func<double, string> Formatter { get; set; }

        public StackedBarChart()
        {
            InitializeComponent();

            SeriesCollection = new SeriesCollection
            {
                new StackedColumnSeries
                {
                    Title = "Positive Matches",
                    Values = new ChartValues<double> {14, 3, 2, 1, 1, 1, 1, 1, 1},
                    StackMode = StackMode.Values, // this is not necessary, values is the default stack mode
                    DataLabels = true
                },
                new StackedColumnSeries
                {
                    Title = "Negative Matches",
                    Values = new ChartValues<double> {3, 14, 15, 16, 16, 16, 16, 16, 16},
                    StackMode = StackMode.Values,
                    DataLabels = true
                }
            };

            Labels = new[] { "MBP", "TbpB", "LbpB", "Contam_1", "Some", "hpua", "testProtien", "testy", "snazzios"};
            Formatter = value => value.ToString();

            DataContext = this;
        }
    }
}

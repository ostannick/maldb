using System;
using System.Collections.Generic;
using System.Diagnostics;
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
using System.Text.RegularExpressions;

namespace malDB
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void RadioButton_Checked(object sender, RoutedEventArgs e)
        {
            Debug.WriteLine("lol1");
        }

        private void RadioButton_Checked_1(object sender, RoutedEventArgs e)
        {
            Debug.WriteLine("lol2");
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            new DBHelper().TestConnection();
        }

        private void CurateInput(object sender, TextChangedEventArgs e)
        {
            //Cast the sender, get the sequence
            TextBox thisInput = (TextBox)sender;
            string proteinSequence = thisInput.Text;

            //Curate the input (remove whitespace, etc)
            string pattern = @"[\s|\d]";
            proteinSequence = Regex.Replace(proteinSequence, pattern, "");

            thisInput.Text = proteinSequence;

            //Trypsinize
            string trypsin = @"(?<=[RK])(?=[^P])";
            string[] peptideSequences = Regex.Split(proteinSequence, trypsin);

            foreach(string s in peptideSequences)
            {
                Debug.WriteLine(s);
            }
        }

        private void OpenSearchSettings(object sender, RoutedEventArgs e)
        {
            SearchSettings searchSettings = new SearchSettings();
            searchSettings.Show();
        }
    }
}

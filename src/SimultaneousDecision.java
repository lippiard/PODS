import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SimultaneousDecision {
	
	private double[][] payoffs;
	
	public SimultaneousDecision(String file) throws FileNotFoundException, IOException {
		BufferedReader br = new BufferedReader(new FileReader(file));
		String line = br.readLine();
		int nlines = 0;
		List<double[]> lines = new ArrayList<>();
		while(line != null) {
			nlines++;
			String[] ps = line.split("\\s+");
			double[] psint = new double[ps.length];
			for (int i = 0; i < ps.length; i++) {
				psint[i] = Double.parseDouble(ps[i]);
			}
			lines.add(psint);
			line = br.readLine();
		}
		payoffs = new double[nlines][];
		int i = 0;
		for (double[] l: lines) {
			payoffs[i] = l;
			i++;
		}
		br.close();
	}
	
	public void printPayoffs() {
		for (int i = 0; i < payoffs.length; i++) {
			for (int j = 0; j < payoffs[i].length; j++) {
				System.out.print(payoffs[i][j] + " ");
			}
			System.out.println(" ");
		}
	}
	
	public double getPayoff(int rowS, int colS) {
		return payoffs[rowS][colS];
	}

}

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

//basic decision 
public class SimultaneousDecision {
	
	private double[][] rowPayoffs;
	private double[][] colPayoffs;
	
	public SimultaneousDecision(String rowFile, String colFile) {
		try {
			this.rowPayoffs = getArrayFromFile(rowFile);
			this.colPayoffs = getArrayFromFile(colFile);
		} catch (Exception e) {
			System.err.println(e);
		}
	}
	
	private static double[][] getArrayFromFile(String file) throws FileNotFoundException, IOException {
		double[][] payoffs;
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
		return payoffs;
	}
	
	public void printPayoffs() {
		for (int k = 1; k < 3; k++) {
			double [][] payoffs;
			if (k == 1) {
				payoffs = rowPayoffs;
				System.out.println("Row Payoffs: ");
			} else {
				payoffs = colPayoffs;
				System.out.println("Column Payoffs: ");
			}
			for (int i = 0; i < payoffs.length; i++) {
				for (int j = 0; j < payoffs[i].length; j++) {
					System.out.print(payoffs[i][j] + " ");
				}
				System.out.println(" ");
			}
		}
	}
	
	public double[] getPayoff(int rowS, int colS) {
		return new double[]{rowPayoffs[rowS][colS], colPayoffs[rowS][colS]};
	}

}

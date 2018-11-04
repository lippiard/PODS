import java.util.Arrays;
import java.util.Scanner;

public class TestRunner {
	
	public static void main(String[] args) {
		testSimultaneousDecision();
	}

	private static void testSimultaneousDecision() {
		String rowPath = "HideAndSeek/Evade/Hider.txt";
		String colPath = "HideAndSeek/Evade/Seeker.txt";
		try {
			SimultaneousDecision sd = new SimultaneousDecision(rowPath, colPath);
			sd.printPayoffs();
			System.out.println("Strategy set: {hider hides in 0, seeker looks in 0}");
			double[] result = sd.getPayoff(0, 0);
			System.out.println(Arrays.toString(result));
			
			Scanner s = new Scanner(System.in);
			System.out.println("hider strategy ");
			int hstrat = s.nextInt();
			System.out.println("seeker strategy ");
			int sstrat = s.nextInt();
			System.out.println(Arrays.toString(sd.getPayoff(hstrat, sstrat)));
			s.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}

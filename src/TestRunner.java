
public class TestRunner {
	
	public static void main(String[] args) {
		testSimultaneousDecision();
	}

	private static void testSimultaneousDecision() {
		String path = "HideAndSeek/Evade/Hider.txt";
		try {
			SimultaneousDecision sd = new SimultaneousDecision(path);
			sd.printPayoffs();
		} catch (Exception e) {
			System.err.println(e);
		}
	}
	
}

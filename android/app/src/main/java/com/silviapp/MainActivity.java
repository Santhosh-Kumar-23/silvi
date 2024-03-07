package development.silvi.asia;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SilviApp";
  }

  // Added for react-native-screens configuration
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      // Added for react-native-splash-screen configuration
      SplashScreen.show(this);

      super.onCreate(null);
  }
}
